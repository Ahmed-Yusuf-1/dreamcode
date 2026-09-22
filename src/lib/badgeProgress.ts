import type { Badge } from "@/content/types";
import type { Catalog, TrackId } from "@/lib/catalog";
import { badgeProgress, expandKeys, RARITY, type BadgeSnapshot } from "@/lib/badges";
import { trackLessons } from "@/lib/catalog";

export interface BadgeSuggestion {
  badge: Badge;
  /** What to do next, in plain words. */
  action: string;
  href: string;
  /** Fraction earned so far, 0 to 1, when the badge can be measured. */
  fraction: number | null;
  /** "3 of 10 lessons", when the badge can be measured. */
  progressLabel: string | null;
}

/** Where a learner should go to move a badge forward. */
function routeFor(badge: Badge, catalog: Catalog, track: TrackId, done: Set<string>): { action: string; href: string } {
  const rule = badge.rule;

  if (rule.keys) {
    const keys = expandKeys(rule.keys.source, catalog);
    const open = keys.find((k) => !done.has(k));
    const lesson = open ? catalog.lessons.find((l) => l.slug === open) : undefined;
    if (lesson) return { action: `Finish the ${lesson.catalogTitle} lesson`, href: `/lesson/${lesson.slug}` };
    const challenge = open ? catalog.challenges.find((c) => c.slug === open) : undefined;
    if (challenge) return { action: `Clear ${challenge.name}`, href: `/challenge/${challenge.slug}` };
  }

  if (rule.count) {
    const { of, track: ruleTrack } = rule.count;
    const target = ruleTrack ?? track;
    if (of === "lesson") {
      const next = trackLessons(catalog, target).find((l) => !done.has(l.slug));
      return next ? { action: `Finish the ${next.catalogTitle} lesson`, href: `/lesson/${next.slug}` } : { action: "Keep going in another track", href: "/lessons" };
    }
    if (of === "practice") return { action: "Finish another practice drill", href: "/lessons" };
    if (of === "challenge") {
      const next = catalog.challenges.find((c) => c.track === target && !done.has(c.slug));
      return next ? { action: `Clear ${next.name}`, href: `/challenge/${next.slug}` } : { action: "Clear another Problem Peak", href: "/peaks" };
    }
    if (of === "project") {
      const next = catalog.projects.find((p) => p.track === target && !done.has(p.id)) ?? catalog.projects.find((p) => !done.has(p.id));
      return next ? { action: `Build ${next.title}`, href: `/project/${next.id}` } : { action: "Build another project", href: "/projects" };
    }
    if (of === "review") return { action: "Run a night review", href: "/review" };
  }

  if (rule.streak !== undefined) return { action: `Come back tomorrow to keep the streak`, href: "/dashboard" };
  if (rule.perfectWeek) return { action: "Earn XP on every day of one week", href: "/dashboard" };
  if (rule.dayCount !== undefined) return { action: "Stack a few activities in one sitting", href: "/lessons" };
  if (rule.tracksWithProject !== undefined) return { action: "Build a project in a language you have not yet", href: "/projects" };
  if (rule.submission) return { action: "Run the tests on a Problem Peak", href: "/peaks" };
  if (rule.hour) return { action: badge.desc, href: "/lessons" };
  return { action: badge.desc, href: "/badges" };
}

/**
 * The locked badges a learner is closest to, each with a concrete next step.
 * Measurable badges are ranked by how far along they are, so the nudge is
 * always the one that is nearly in hand. Secret badges are never suggested.
 */
export function nextBadges(catalog: Catalog, track: TrackId, snap: BadgeSnapshot, unlocked: Iterable<string>, limit = 3): BadgeSuggestion[] {
  const have = new Set(unlocked);
  const done = new Set(snap.completed);
  const scored: (BadgeSuggestion & { score: number })[] = [];

  for (const badge of catalog.badges) {
    if (have.has(badge.id) || badge.secret) continue;
    const progress = badgeProgress(badge, snap, catalog);
    const { action, href } = routeFor(badge, catalog, track, done);
    const fraction = progress && progress.target > 0 ? progress.current / progress.target : null;
    // Started and nearly finished first; then cheap badges; rarity breaks ties.
    const score = (fraction ?? 0) * 100 - RARITY[badge.rarity].order * 6 + (progress && progress.target <= 5 ? 8 : 0);
    scored.push({ badge, action, href, fraction, progressLabel: progress?.label ?? null, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ badge, action, href, fraction, progressLabel }) => ({ badge, action, href, fraction, progressLabel }));
}

/** The single closest badge, for the dashboard. */
export function nextBadge(catalog: Catalog, track: TrackId, snap: BadgeSnapshot, unlocked: Iterable<string>): BadgeSuggestion | null {
  return nextBadges(catalog, track, snap, unlocked, 1)[0] ?? null;
}
