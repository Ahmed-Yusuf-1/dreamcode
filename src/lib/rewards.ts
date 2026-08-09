import { getModules } from "@/lib/curriculum";
import { challenges, practiceDatasets, projects } from "@/lib/data";
import type { Track } from "@/lib/track";

export interface ActivityReward {
  xp: number;
  badgeIds: string[];
}

const TRACKS: Track[] = ["python", "javascript", "csharp", "typescript"];

function buildRewardCatalog() {
  const catalog = new Map<string, ActivityReward>();

  for (const track of TRACKS) {
    for (const lesson of getModules(track).flatMap((module) => module.lessons)) {
      catalog.set(lesson.slug, {
        xp: 15,
        badgeIds: [
          ...(lesson.slug.includes("loops") ? ["first-loop"] : []),
          ...(lesson.slug.includes("lists") || lesson.slug.includes("arrays") ? ["list-wrangler"] : []),
          ...(lesson.slug.includes("dictionaries") ? ["dict-diver"] : []),
          ...(lesson.slug.includes("functions") ? ["function-forger"] : []),
        ],
      });
    }
  }

  for (const slug of Object.keys(practiceDatasets)) {
    catalog.set(`practice:${slug}`, {
      xp: 20,
      badgeIds: slug.includes("loops") ? ["first-loop"] : [],
    });
  }

  for (const challenge of Object.values(challenges)) {
    catalog.set(challenge.slug, {
      xp: challenge.xp,
      badgeIds: challenge.badge ? [challenge.badge] : [],
    });
  }

  for (const project of projects) {
    catalog.set(project.id, { xp: project.xp, badgeIds: ["sky-builder"] });
  }

  for (const track of TRACKS) {
    catalog.set(`placement:${track}`, { xp: 50, badgeIds: [] });
  }

  return catalog;
}

const REWARD_CATALOG = buildRewardCatalog();

export function getActivityReward(activityKey: string): ActivityReward | null {
  const fixed = REWARD_CATALOG.get(activityKey);
  if (fixed) return fixed;

  // A review session is repeatable over time, but only once per local calendar
  // day and track. The route additionally verifies that the date is today.
  if (/^review:\d{4}-\d{2}-\d{2}:(python|javascript|csharp|typescript)$/.test(activityKey)) {
    return { xp: 20, badgeIds: [] };
  }
  return null;
}
