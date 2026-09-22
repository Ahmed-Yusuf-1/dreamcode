"use client";

import type { TrackId } from "@/lib/catalog";

const KEY = "dc_placement";

/** Lesson slug the placement check recommended per track (never marks lessons done). */
export function getPlacements(): Partial<Record<TrackId, string>> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<Record<TrackId, string>>) : {};
  } catch {
    return {};
  }
}

export function savePlacement(track: TrackId, lessonSlug: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...getPlacements(), [track]: lessonSlug }));
  } catch {
    /* ignore */
  }
}
