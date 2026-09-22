import type { Badge, BadgeKeySource, BadgeRarity, BadgeRule, TrackId } from "@/content/types";
import type { Catalog } from "@/lib/catalog";
import { buildActivityMeta, metaForKey } from "@/lib/activityMeta";

/**
 * Badge evaluation. Rules are data (src/content/badges.ts); this module decides
 * whether a learner meets one, and how close they are when they do not. The
 * same rules run in Postgres (badge_rules + evaluate_badges), so a guest who
 * signs up keeps every badge they earned, and nothing can be awarded twice.
 */

export interface RarityMeta {
  label: string;
  /** Bonus XP the moment the badge is earned. */
  xp: number;
  /** Ring colour on the medallion and the wall. */
  ring: string;
  order: number;
  blurb: string;
}

export const RARITY: Record<BadgeRarity, RarityMeta> = {
  common: { label: "Common", xp: 25, ring: "#a9c4e8", order: 0, blurb: "The first hour or two." },
  rare: { label: "Rare", xp: 75, ring: "#6ea8ff", order: 1, blurb: "A week of real work, or a habit worth keeping." },
  epic: { label: "Epic", xp: 200, ring: "#c9a0ff", order: 2, blurb: "A chapter of a track, a month of days." },
  legendary: { label: "Legendary", xp: 600, ring: "#ffd86b", order: 3, blurb: "A whole road walked end to end. Few ever hold one." },
};

export const RARITY_ORDER: BadgeRarity[] = ["legendary", "epic", "rare", "common"];

/**
 * A snapshot of everything a badge rule can ask about. Built from the learner's
 * profile at the moment something is completed.
 */
export interface BadgeSnapshot {
  /** Every completed activity key. */
  completed: string[];
  /** Consecutive active days, as of today. */
  streak: number;
  /** XP earned on each day of the current week, Monday first. */
  weekActivity: number[];
  /** Activities finished today, in the learner's local day. */
  dayCount: number;
  /** Local hour of the lesson just finished, when one was. */
  lessonHour?: number;
  /** Days since the learner's last activity, when they have just returned. */
  daysAway?: number;
  /** Set when this evaluation follows a graded submission. */
  submission?: { failed?: boolean; failThenPass?: boolean; firstTry?: boolean };
}

export const EMPTY_SNAPSHOT: BadgeSnapshot = { completed: [], streak: 0, weekActivity: [0, 0, 0, 0, 0, 0, 0], dayCount: 0 };

/** The activity keys a key-rule asks for. */
export function expandKeys(source: BadgeKeySource, catalog: Catalog): string[] {
  if (source.of === "keys") return source.keys;
  if (source.of === "trackLessons") {
    return catalog.lessons
      .filter((l) => l.track === source.track && (!source.tier || l.tier === source.tier))
      .map((l) => l.slug);
  }
  const challenges = catalog.challenges.filter((c) => c.track === source.track).map((c) => c.slug);
  if (source.of === "trackChallenges") return challenges;
  return [...catalog.lessons.filter((l) => l.track === source.track).map((l) => l.slug), ...challenges];
}

interface Counted {
  current: number;
  target: number;
}

function countRule(rule: NonNullable<BadgeRule["count"]>, snap: BadgeSnapshot, catalog: Catalog): Counted {
  const meta = buildActivityMeta(catalog);
  let current = 0;
  for (const key of snap.completed) {
    const m = metaForKey(key, meta);
    if (!m || m.kind !== rule.of) continue;
    if (rule.track && m.track !== rule.track) continue;
    if (rule.tier && m.tier !== rule.tier) continue;
    current += 1;
  }
  return { current, target: rule.n };
}

function keyRule(rule: NonNullable<BadgeRule["keys"]>, snap: BadgeSnapshot, catalog: Catalog): Counted {
  const keys = expandKeys(rule.source, catalog);
  const done = new Set(snap.completed);
  const current = keys.filter((k) => done.has(k)).length;
  return { current, target: rule.mode === "any" ? Math.min(1, keys.length) : keys.length };
}

function projectTracks(snap: BadgeSnapshot, catalog: Catalog): Set<TrackId> {
  const done = new Set(snap.completed);
  const tracks = new Set<TrackId>();
  for (const project of catalog.projects) if (done.has(project.id)) tracks.add(project.track);
  return tracks;
}

/**
 * How close a learner is to a badge, as a fraction and a sentence. Rules that
 * cannot be measured (a moment of the day, one submission) report no bar.
 */
export function badgeProgress(badge: Badge, snap: BadgeSnapshot, catalog: Catalog): { current: number; target: number; label: string } | null {
  const rule = badge.rule;
  if (rule.count) {
    const { current, target } = countRule(rule.count, snap, catalog);
    const noun = rule.count.of === "practice" ? "drills" : `${rule.count.of}s`;
    return { current: Math.min(current, target), target, label: `${Math.min(current, target)} of ${target} ${noun}` };
  }
  if (rule.keys) {
    const { current, target } = keyRule(rule.keys, snap, catalog);
    if (rule.keys.mode === "any") return null;
    return { current: Math.min(current, target), target, label: `${Math.min(current, target)} of ${target} stops` };
  }
  if (rule.streak !== undefined) {
    return { current: Math.min(snap.streak, rule.streak), target: rule.streak, label: `${Math.min(snap.streak, rule.streak)} of ${rule.streak} days in a row` };
  }
  if (rule.tracksWithProject !== undefined) {
    const have = projectTracks(snap, catalog).size;
    return { current: Math.min(have, rule.tracksWithProject), target: rule.tracksWithProject, label: `${Math.min(have, rule.tracksWithProject)} of ${rule.tracksWithProject} languages` };
  }
  if (rule.perfectWeek) {
    const days = snap.weekActivity.filter((xp) => xp > 0).length;
    return { current: days, target: 7, label: `${days} of 7 days this week` };
  }
  if (rule.dayCount !== undefined) {
    return { current: Math.min(snap.dayCount, rule.dayCount), target: rule.dayCount, label: `${Math.min(snap.dayCount, rule.dayCount)} of ${rule.dayCount} today` };
  }
  return null;
}

/** True when every condition of the badge's rule holds right now. */
export function badgeMet(badge: Badge, snap: BadgeSnapshot, catalog: Catalog): boolean {
  const rule = badge.rule;
  let asked = false;

  if (rule.keys) {
    asked = true;
    const { current, target } = keyRule(rule.keys, snap, catalog);
    if (target === 0) return false;
    if (rule.keys.mode === "any" ? current < 1 : current < target) return false;
  }
  if (rule.count) {
    asked = true;
    const { current, target } = countRule(rule.count, snap, catalog);
    if (current < target) return false;
  }
  if (rule.streak !== undefined) {
    asked = true;
    if (snap.streak < rule.streak) return false;
  }
  if (rule.hour) {
    asked = true;
    if (snap.lessonHour === undefined || snap.lessonHour < rule.hour.from || snap.lessonHour > rule.hour.to) return false;
  }
  if (rule.dayCount !== undefined) {
    asked = true;
    if (snap.dayCount < rule.dayCount) return false;
  }
  if (rule.perfectWeek) {
    asked = true;
    if (snap.weekActivity.filter((xp) => xp > 0).length < 7) return false;
  }
  if (rule.tracksWithProject !== undefined) {
    asked = true;
    if (projectTracks(snap, catalog).size < rule.tracksWithProject) return false;
  }
  if (rule.comebackDays !== undefined) {
    asked = true;
    if ((snap.daysAway ?? 0) < rule.comebackDays) return false;
  }
  if (rule.submission) {
    asked = true;
    const s = snap.submission;
    if (!s) return false;
    if (rule.submission === "failed" && !s.failed) return false;
    if (rule.submission === "fail-then-pass" && !s.failThenPass) return false;
    if (rule.submission === "first-try" && !s.firstTry) return false;
  }

  // A rule with no conditions must never award itself.
  return asked;
}

/** Badge ids the learner has just earned, newest rules first by rarity. */
export function evaluateBadges(snap: BadgeSnapshot, catalog: Catalog, owned: Iterable<string>): string[] {
  const have = new Set(owned);
  const earned: Badge[] = [];
  for (const badge of catalog.badges) {
    if (have.has(badge.id)) continue;
    if (badgeMet(badge, snap, catalog)) earned.push(badge);
  }
  return earned.sort((a, b) => RARITY[b.rarity].order - RARITY[a.rarity].order).map((b) => b.id);
}

/** Bonus XP for a set of freshly earned badges. */
export function badgeXp(badgeIds: string[], catalog: Catalog): number {
  const byId = new Map(catalog.badges.map((b) => [b.id, b]));
  return badgeIds.reduce((sum, id) => {
    const badge = byId.get(id);
    return sum + (badge ? RARITY[badge.rarity].xp : 0);
  }, 0);
}
