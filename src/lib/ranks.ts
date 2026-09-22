import type { Catalog, TrackId } from "@/lib/catalog";
import { trackLessons } from "@/lib/catalog";

/**
 * Levels, ranks and per-track skill. XP buys levels; levels carry a rank name,
 * which is the title a learner wears on their profile and on the leaderboard.
 */

export const XP_PER_LEVEL = 800;
/** XP that counts as a day well spent. The dashboard ring fills to this. */
export const DAILY_GOAL_XP = 40;

export interface Rank {
  /** Lowest level that carries this rank. */
  from: number;
  name: string;
  accent: string;
}

export const RANKS: Rank[] = [
  { from: 1, name: "Stargazer", accent: "#9ad1ff" },
  { from: 3, name: "Cloudwalker", accent: "#a9ecc9" },
  { from: 6, name: "Skyfarer", accent: "#ffe49a" },
  { from: 10, name: "Stormrider", accent: "#ff9f45" },
  { from: 15, name: "Constellation", accent: "#c9b5ff" },
  { from: 20, name: "Aurora", accent: "#7ef2d0" },
  { from: 30, name: "Celestial", accent: "#ffd86b" },
];

export function rankForLevel(level: number): Rank {
  let rank = RANKS[0];
  for (const candidate of RANKS) if (level >= candidate.from) rank = candidate;
  return rank;
}

/** The next rank up, and the level it starts at. Null at the top of the ladder. */
export function nextRank(level: number): Rank | null {
  return RANKS.find((r) => r.from > level) ?? null;
}

export function levelFromTotalXp(totalXp: number): number {
  return Math.floor(Math.max(0, totalXp) / XP_PER_LEVEL) + 1;
}

export function totalXp(level: number, xpInLevel: number): number {
  return (Math.max(1, level) - 1) * XP_PER_LEVEL + Math.max(0, xpInLevel);
}

export type SkillLabel = "Not started" | "Initiate" | "Adept" | "Veteran" | "Master";

export interface TrackSkill {
  track: TrackId;
  percent: number;
  label: SkillLabel;
  lessonsDone: number;
  lessons: number;
  challengesDone: number;
  challenges: number;
  projectsDone: number;
  projects: number;
}

/**
 * How far a learner has walked one track. Lessons carry most of the weight,
 * with challenges and projects on top, so the number matches the feeling of
 * "how much of this language do I know".
 */
export function trackSkill(catalog: Catalog, track: TrackId, completed: Iterable<string>): TrackSkill {
  const done = new Set(completed);
  const lessons = trackLessons(catalog, track);
  const challenges = catalog.challenges.filter((c) => c.track === track);
  const projects = catalog.projects.filter((p) => p.track === track);
  const lessonsDone = lessons.filter((l) => done.has(l.slug)).length;
  const challengesDone = challenges.filter((c) => done.has(c.slug)).length;
  const projectsDone = projects.filter((p) => done.has(p.id)).length;

  // Only the parts a track actually has count, so a read-and-quiz track is not
  // credited for peaks and projects it will never have.
  const parts = [
    { done: lessonsDone, total: lessons.length, weight: 70 },
    { done: challengesDone, total: challenges.length, weight: 20 },
    { done: projectsDone, total: projects.length, weight: 10 },
  ].filter((part) => part.total > 0);
  const totalWeight = parts.reduce((sum, part) => sum + part.weight, 0) || 1;
  const raw = parts.reduce((sum, part) => sum + (part.done / part.total) * (part.weight / totalWeight) * 100, 0);
  const percent = Math.round(Math.min(100, raw));

  const complete = lessonsDone === lessons.length && challengesDone === challenges.length && projectsDone === projects.length;
  const label: SkillLabel = complete ? "Master" : percent === 0 ? "Not started" : percent < 25 ? "Initiate" : percent < 60 ? "Adept" : "Veteran";
  return { track, percent, label, lessonsDone, lessons: lessons.length, challengesDone, challenges: challenges.length, projectsDone, projects: projects.length };
}

/** Every track a learner has touched, strongest first. */
export function skillsByStrength(catalog: Catalog, completed: Iterable<string>, tracks: TrackId[]): TrackSkill[] {
  const done = [...completed];
  return tracks.map((t) => trackSkill(catalog, t, done)).sort((a, b) => b.percent - a.percent);
}
