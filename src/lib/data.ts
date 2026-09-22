/**
 * Practice drills, graded challenges, projects and badges. The content itself
 * lives in src/content; this module assembles it and offers lookup helpers.
 *
 * Like curriculum.ts this carries full content, so prefer the catalog
 * (src/lib/catalog.ts) in client components that only need names and links.
 */
import { pythonPractice } from "@/content/practice/python";
import { pythonMorePractice } from "@/content/practice/python-more";
import { pythonAdvancedPractice } from "@/content/practice/python-advanced";
import { pythonDataPractice } from "@/content/practice/python-data";
import { javascriptPractice } from "@/content/practice/javascript";
import { javascriptMorePractice } from "@/content/practice/javascript-more";
import { javascriptAdvancedPractice } from "@/content/practice/javascript-advanced";
import { typescriptPractice } from "@/content/practice/typescript";
import { typescriptMorePractice } from "@/content/practice/typescript-more";
import { challenges, moduleChallenges } from "@/content/challenges";
import type { Challenge, PracticeDataset } from "@/content/types";

export type {
  Badge,
  BadgeIcon,
  Challenge,
  ChallengeLanguage,
  ChallengeLevel,
  ChallengeTestCase,
  ParsonsFragment,
  PracticeDataset,
  Project,
  ProjectTier,
} from "@/content/types";
export { challenges, moduleChallenges } from "@/content/challenges";
export { projects } from "@/content/projects";
export { badges } from "@/content/badges";

export const practiceDatasets: Record<string, PracticeDataset> = {
  ...pythonPractice,
  ...pythonMorePractice,
  ...pythonAdvancedPractice,
  ...pythonDataPractice,
  ...javascriptPractice,
  ...javascriptMorePractice,
  ...javascriptAdvancedPractice,
  ...typescriptPractice,
  ...typescriptMorePractice,
};

/** The section challenge for a module, or null if none is mapped/authored yet. */
export function getModuleChallenge(moduleName: string): Challenge | null {
  const slug = moduleChallenges[moduleName];
  if (!slug) return null;
  return challenges[slug] ?? null;
}
