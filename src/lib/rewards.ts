/**
 * XP for every activity a learner can complete. The same rules run on the
 * client (optimistic guest progress) and on the server (the authoritative award
 * for signed-in learners), each against its own catalog, so the browser can
 * never invent an activity or choose its own XP.
 *
 * Badges are not listed here: they are earned by rule from the learner's whole
 * history (src/lib/badges.ts), not handed out per activity.
 */
import type { Catalog } from "@/lib/catalog";

export interface ActivityReward {
  xp: number;
}

export const LESSON_XP = 15;
export const PRACTICE_XP = 20;
export const PLACEMENT_XP = 50;
export const REVIEW_XP = 20;

const REVIEW_KEY = /^review:\d{4}-\d{2}-\d{2}:(python|javascript|csharp|typescript)$/;
const PLACEMENT_KEY = /^placement:(python|javascript|csharp|typescript)$/;

export type ActivityKind = "lesson" | "practice" | "challenge" | "project" | "placement" | "review";

export function activityKind(activityKey: string): ActivityKind | null {
  if (activityKey.startsWith("practice:")) return "practice";
  if (PLACEMENT_KEY.test(activityKey)) return "placement";
  if (REVIEW_KEY.test(activityKey)) return "review";
  return null;
}

export function getActivityReward(activityKey: string, catalog: Catalog): ActivityReward | null {
  if (activityKey.startsWith("practice:")) {
    const slug = activityKey.slice("practice:".length);
    return catalog.lessons.some((l) => l.practiceSlug === slug) ? { xp: PRACTICE_XP } : null;
  }
  if (PLACEMENT_KEY.test(activityKey)) return { xp: PLACEMENT_XP };
  // A review session is repeatable over time, but only once per local calendar
  // day and track. The server additionally checks that the date is current.
  if (REVIEW_KEY.test(activityKey)) return { xp: REVIEW_XP };

  const lesson = catalog.lessons.find((l) => l.slug === activityKey);
  if (lesson) return { xp: LESSON_XP };

  const challenge = catalog.challenges.find((c) => c.slug === activityKey);
  if (challenge) return { xp: challenge.xp };

  const project = catalog.projects.find((p) => p.id === activityKey);
  if (project) return { xp: project.xp };

  return null;
}

/** True when the activity is a lesson (the night-owl badge counts lessons only). */
export function isLessonActivity(activityKey: string, catalog: Catalog) {
  return catalog.lessons.some((l) => l.slug === activityKey);
}
