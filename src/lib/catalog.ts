/**
 * The lightweight course catalog: names, order, modules and links for every
 * lesson, challenge and project, without lesson bodies. The root layout builds it
 * on the server (catalog.server.ts) and hands it to the client once, so hub pages,
 * the nav, the coach and the reward rules never ship the full curriculum.
 *
 * Everything in this file is pure and client-safe. Do not import content here.
 */
import type { Badge, ChallengeLanguage, ChallengeLevel, ProjectTier, Tier, TrackId } from "@/content/types";

export type { TrackId, Tier } from "@/content/types";

export interface LessonMeta {
  slug: string;
  order: number;
  track: TrackId;
  module: string;
  tier: Tier;
  title: string;
  catalogTitle: string;
  blurb: string;
  catalogCode: string;
  runnable: boolean;
  /** Present only when a practice drill really exists for this lesson. */
  practiceSlug?: string;
  hasTask: boolean;
}

export interface ChallengeMeta {
  slug: string;
  name: string;
  level: ChallengeLevel;
  language: ChallengeLanguage;
  track: TrackId;
  xp: number;
  blurb: string;
  /** Module this challenge caps, when it is a section challenge. */
  module?: string;
  /** Lesson that unlocks it as a standalone peak. */
  requires?: string;
}

export interface ProjectMeta {
  id: string;
  tier: ProjectTier;
  title: string;
  desc: string;
  xp: number;
  language: ChallengeLanguage;
  track: TrackId;
  requires: string[];
}

export interface Catalog {
  lessons: LessonMeta[];
  challenges: ChallengeMeta[];
  projects: ProjectMeta[];
  badges: Badge[];
}

export interface ModuleMeta {
  name: string;
  tier: Tier;
  track: TrackId;
  /** 1-based chapter number within the track. */
  chapter: number;
  lessons: LessonMeta[];
  challenge?: ChallengeMeta;
}

export const TRACKS: { id: TrackId; label: string; short: string; runtime: "browser" | "quiz"; blurb: string }[] = [
  { id: "python", label: "Python", short: "PY", runtime: "browser", blurb: "Real CPython in your browser" },
  { id: "javascript", label: "JavaScript", short: "JS", runtime: "browser", blurb: "The language of the web" },
  { id: "typescript", label: "TypeScript", short: "TS", runtime: "browser", blurb: "JavaScript with a type checker" },
  { id: "csharp", label: "C#", short: "C#", runtime: "quiz", blurb: "Read and quiz track" },
];

export function trackLabel(track: TrackId): string {
  return TRACKS.find((t) => t.id === track)?.label ?? track;
}

export function trackFromLanguage(language: ChallengeLanguage): TrackId {
  return language === "Python" ? "python" : language === "JavaScript" ? "javascript" : "typescript";
}

export function isTrackId(value: unknown): value is TrackId {
  return value === "python" || value === "javascript" || value === "typescript" || value === "csharp";
}

export function trackLessons(catalog: Catalog, track: TrackId): LessonMeta[] {
  return catalog.lessons.filter((l) => l.track === track);
}

export function getLessonMeta(catalog: Catalog, slug: string): LessonMeta | undefined {
  return catalog.lessons.find((l) => l.slug === slug);
}

/** Lessons grouped into modules (chapters) with their section challenge. */
export function getTrackModules(catalog: Catalog, track: TrackId): ModuleMeta[] {
  const modules: ModuleMeta[] = [];
  const byName = new Map<string, ModuleMeta>();
  for (const lesson of trackLessons(catalog, track)) {
    let mod = byName.get(lesson.module);
    if (!mod) {
      mod = {
        name: lesson.module,
        tier: lesson.tier,
        track,
        chapter: modules.length + 1,
        lessons: [],
        challenge: catalog.challenges.find((c) => c.module === lesson.module),
      };
      byName.set(lesson.module, mod);
      modules.push(mod);
    }
    mod.lessons.push(lesson);
  }
  return modules;
}

/** First lesson in a track not yet completed, or the last one when all are done. */
export function nextLessonFor(catalog: Catalog, track: TrackId, completed: string[]): LessonMeta | undefined {
  const ls = trackLessons(catalog, track);
  const done = new Set(completed);
  return ls.find((l) => !done.has(l.slug)) ?? ls[ls.length - 1];
}

export function lessonsDone(catalog: Catalog, track: TrackId, completed: string[]) {
  const done = new Set(completed);
  const ls = trackLessons(catalog, track);
  return { done: ls.filter((l) => done.has(l.slug)).length, total: ls.length };
}

export function moduleComplete(mod: Pick<ModuleMeta, "lessons">, completed: string[]) {
  const done = new Set(completed);
  return mod.lessons.every((l) => done.has(l.slug));
}

/**
 * A challenge is open once the learner has what it needs: section challenges
 * need their whole module, standalone peaks need their required lesson.
 */
export function challengeUnlocked(catalog: Catalog, challenge: ChallengeMeta, completed: string[]): boolean {
  const done = new Set(completed);
  if (challenge.module) {
    const lessonsInModule = catalog.lessons.filter((l) => l.module === challenge.module);
    return lessonsInModule.length > 0 && lessonsInModule.every((l) => done.has(l.slug));
  }
  if (challenge.requires) return done.has(challenge.requires);
  return true;
}

export function projectUnlocked(project: ProjectMeta, completed: string[]): boolean {
  const done = new Set(completed);
  return project.requires.every((key) => done.has(key));
}

export type ProgressState = "done" | "current" | "locked";

/** Lesson state on the map: done, the one to do next, or waiting behind it. */
export function lessonState(catalog: Catalog, lesson: LessonMeta, completed: string[]): ProgressState {
  const done = new Set(completed);
  if (done.has(lesson.slug)) return "done";
  const ls = trackLessons(catalog, lesson.track);
  const i = ls.findIndex((l) => l.slug === lesson.slug);
  if (i <= 0 || done.has(ls[i - 1].slug)) return "current";
  return "locked";
}
