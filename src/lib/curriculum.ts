/**
 * The curriculum: the source of truth for lessons. Lesson content lives in
 * src/content/lessons/<track>.ts; this module stitches the tracks together and
 * provides the ordering helpers every page relies on.
 *
 * This module carries every lesson body, so import it from server components
 * (pages, route handlers, sitemap). Client components should use the lightweight
 * catalog from src/lib/catalog.ts instead.
 */
import { pythonLessons } from "@/content/lessons/python";
import { pythonMoreLessons } from "@/content/lessons/python-more";
import { pythonAdvancedLessons } from "@/content/lessons/python-advanced";
import { javascriptLessons } from "@/content/lessons/javascript";
import { javascriptMoreLessons } from "@/content/lessons/javascript-more";
import { javascriptAdvancedLessons } from "@/content/lessons/javascript-advanced";
import { typescriptLessons } from "@/content/lessons/typescript";
import { typescriptMoreLessons } from "@/content/lessons/typescript-more";
import { csharpLessons } from "@/content/lessons/csharp";
import type { Lesson, Tier, TrackId } from "@/content/types";

export type { Lesson, LessonTask, QuizQuestion, ReadsBullet, Tier, TrackId } from "@/content/types";

export const TRACK_IDS: TrackId[] = ["python", "javascript", "typescript", "csharp"];

const byOrder = (a: Lesson, b: Lesson) => a.order - b.order;

/** Every lesson, grouped by track and sorted by order within each track. */
export const lessons: Lesson[] = [
  ...[...pythonLessons, ...pythonMoreLessons, ...pythonAdvancedLessons].sort(byOrder),
  ...[...javascriptLessons, ...javascriptMoreLessons, ...javascriptAdvancedLessons].sort(byOrder),
  ...[...typescriptLessons, ...typescriptMoreLessons].sort(byOrder),
  ...[...csharpLessons].sort(byOrder),
];

export const lessonCount = lessons.length;

export function lessonTrack(lesson: Pick<Lesson, "language">): TrackId {
  return lesson.language || "python";
}

export function moduleOf(lesson: Pick<Lesson, "module" | "chapter">): string {
  return lesson.module || lesson.chapter || "Basics";
}

export function getLesson(slug: string): Lesson | null {
  return lessons.find((l) => l.slug === slug) ?? null;
}

export function getAllLessonSlugs(): string[] {
  return lessons.map((l) => l.slug);
}

export function getTrackLessons(track: TrackId): Lesson[] {
  return lessons.filter((l) => lessonTrack(l) === track);
}

/** The first lesson of a track, by order (the true "lesson 1" / start here). */
export function getFirstLesson(track: TrackId): Lesson | null {
  return getTrackLessons(track)[0] ?? null;
}

/**
 * The learner's next lesson in a track: the first not-yet-completed one by order,
 * or the last lesson once every one is done.
 */
export function getNextLesson(track: TrackId, completedStops: string[]): Lesson | null {
  const ls = getTrackLessons(track);
  if (ls.length === 0) return null;
  const done = new Set(completedStops);
  return ls.find((l) => !done.has(l.slug)) ?? ls[ls.length - 1];
}

export interface LessonLink {
  slug: string;
  title: string;
}

export function getAdjacent(slug: string): { prev: LessonLink | null; next: LessonLink | null } {
  const current = getLesson(slug);
  if (!current) return { prev: null, next: null };
  const trackLessons = getTrackLessons(lessonTrack(current));
  const i = trackLessons.findIndex((l) => l.slug === slug);
  const toLink = (l: Lesson): LessonLink => ({ slug: l.slug, title: l.catalogTitle });
  return {
    prev: i > 0 ? toLink(trackLessons[i - 1]) : null,
    next: i >= 0 && i < trackLessons.length - 1 ? toLink(trackLessons[i + 1]) : null,
  };
}

export interface Module {
  name: string;
  tier: Tier;
  lessons: Lesson[];
}

/** Lessons of a track grouped into modules, in curriculum order. */
export function getModules(track: TrackId): Module[] {
  const modules: Module[] = [];
  const byName = new Map<string, Module>();
  for (const lesson of getTrackLessons(track)) {
    const name = moduleOf(lesson);
    let mod = byName.get(name);
    if (!mod) {
      mod = { name, tier: lesson.tier || "beginner", lessons: [] };
      byName.set(name, mod);
      modules.push(mod);
    }
    mod.lessons.push(lesson);
  }
  return modules;
}
