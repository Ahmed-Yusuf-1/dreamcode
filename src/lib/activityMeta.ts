import type { Tier, TrackId } from "@/content/types";
import type { Catalog } from "@/lib/catalog";
import { trackFromLanguage } from "@/lib/catalog";

export type ActivityKind = "lesson" | "practice" | "challenge" | "project" | "placement" | "review";

export interface ActivityMeta {
  kind: ActivityKind;
  track: TrackId | null;
  tier: Tier | null;
}

/**
 * What every authored activity key is: its kind, its track and its tier. Badge
 * counting rules read this, and the same table is generated into Postgres
 * (activity_meta) so the server counts exactly what the browser counts.
 *
 * Review and placement keys carry a date or a track and are not authored, so
 * they are classified by shape in `metaForKey` instead of listed here.
 */
export function buildActivityMeta(catalog: Catalog): Map<string, ActivityMeta> {
  const meta = new Map<string, ActivityMeta>();
  for (const lesson of catalog.lessons) {
    meta.set(lesson.slug, { kind: "lesson", track: lesson.track, tier: lesson.tier ?? null });
    if (lesson.practiceSlug) {
      meta.set(`practice:${lesson.practiceSlug}`, { kind: "practice", track: lesson.track, tier: lesson.tier ?? null });
    }
  }
  for (const challenge of catalog.challenges) {
    meta.set(challenge.slug, { kind: "challenge", track: challenge.track, tier: null });
  }
  for (const project of catalog.projects) {
    meta.set(project.id, { kind: "project", track: trackFromLanguage(project.language), tier: null });
  }
  return meta;
}

const REVIEW_KEY = /^review:\d{4}-\d{2}-\d{2}:(python|javascript|csharp|typescript)$/;
const PLACEMENT_KEY = /^placement:(python|javascript|csharp|typescript)$/;

/** Meta for one key, including the dated review and placement keys. */
export function metaForKey(key: string, meta: Map<string, ActivityMeta>): ActivityMeta | null {
  const authored = meta.get(key);
  if (authored) return authored;
  if (REVIEW_KEY.test(key)) return { kind: "review", track: key.split(":")[2] as TrackId, tier: null };
  if (PLACEMENT_KEY.test(key)) return { kind: "placement", track: key.split(":")[1] as TrackId, tier: null };
  return null;
}
