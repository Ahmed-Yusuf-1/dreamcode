"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Spaced repetition with an FSRS-style scheduler (stability, difficulty,
 * retrievability). Card state lives in localStorage and, when signed in, in the
 * srs_cards table. A card that has never been rated is due as soon as its lesson
 * is complete.
 */

export type Rating = "again" | "good" | "easy";

export interface FSRSCardState {
  cardId: string;
  dueAt: number; // timestamp in ms
  stability: number; // days
  difficulty: number; // 1..10
  reps: number;
  updatedAt: number; // timestamp in ms
}

const STORAGE_KEY = "dc_srs_full_states";
export const SRS_CHANGE_EVENT = "dc_srs_change";
const DAY = 24 * 3600 * 1000;

let isUserSignedIn = false;

if (typeof window !== "undefined" && isSupabaseConfigured()) {
  const supabase = createClient();
  supabase.auth.getSession().then(({ data }) => {
    isUserSignedIn = !!data.session;
    if (isUserSignedIn) syncSrsFromApi();
  });
  supabase.auth.onAuthStateChange((event, session) => {
    isUserSignedIn = !!session;
    if (session && event === "SIGNED_IN") syncSrsFromApi();
  });
}

interface ApiSrsCard {
  cardId: string;
  dueAt: string;
  stability: number;
  difficulty: number;
  reps: number;
  updatedAt?: string;
}

function readStates(): Record<string, FSRSCardState> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved) as Record<string, FSRSCardState>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStates(states: Record<string, FSRSCardState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {
    /* storage unavailable: schedule lives for this session only */
  }
  window.dispatchEvent(new Event(SRS_CHANGE_EVENT));
}

/** Replaces the local schedule with the account's (server is the source of truth). */
async function syncSrsFromApi() {
  try {
    const res = await fetch("/api/srs");
    if (!res.ok) return;
    const data = await res.json();
    if (!Array.isArray(data.cards)) return;
    const states: Record<string, FSRSCardState> = {};
    for (const card of data.cards as ApiSrsCard[]) {
      states[card.cardId] = {
        cardId: card.cardId,
        dueAt: new Date(card.dueAt).getTime(),
        stability: card.stability,
        difficulty: card.difficulty,
        reps: card.reps,
        updatedAt: card.updatedAt ? new Date(card.updatedAt).getTime() : Date.now(),
      };
    }
    writeStates(states);
  } catch (e) {
    console.error("Failed to sync reviews", e);
  }
}

/** Core FSRS-style update for one rating. */
function schedule(rating: Rating, current: FSRSCardState | undefined, now = Date.now()): FSRSCardState {
  if (!current || current.reps === 0) {
    const [stability, difficulty] = rating === "again" ? [0.4, 6.81] : rating === "easy" ? [5.8, 3.99] : [2.4, 4.93];
    return {
      cardId: current?.cardId ?? "",
      dueAt: rating === "again" ? now + 60_000 : now + stability * DAY,
      stability,
      difficulty,
      reps: 1,
      updatedAt: now,
    };
  }

  const elapsedDays = Math.max(0.01, (now - current.updatedAt) / DAY);
  const retrievability = Math.pow(0.9, elapsedDays / current.stability);
  let difficulty = current.difficulty;
  let stability = current.stability;

  if (rating === "again") {
    difficulty = Math.min(10, current.difficulty + 0.86);
    const forgetting =
      2.18 * Math.pow(difficulty, -0.05) * (Math.pow(current.stability + 1, 0.34) - 1) * Math.exp(0.34 * (1 - retrievability));
    stability = Math.max(0.1, Math.min(forgetting, current.stability * 0.5, 0.4));
  } else {
    difficulty = rating === "easy" ? Math.max(1, current.difficulty - 0.94) : Math.max(1, Math.min(10, current.difficulty));
    const growth =
      1 + Math.exp(1.49) * (11 - difficulty) * Math.pow(current.stability, -0.14) * (Math.exp((1 - retrievability) * 0.94) - 1);
    stability = current.stability * Math.max(1.05, growth) * (rating === "easy" ? 1.26 : 1);
  }

  return {
    cardId: current.cardId,
    dueAt: rating === "again" ? now + 60_000 : now + stability * DAY,
    stability,
    difficulty,
    reps: current.reps + 1,
    updatedAt: now,
  };
}

/** Due time (ms) for every card that has been rated at least once. */
export function getSRSStates(): Record<string, number> {
  const states = readStates();
  const result: Record<string, number> = {};
  for (const [id, state] of Object.entries(states)) result[id] = state.dueAt;
  return result;
}

/** True when a card is due: never rated, or its due time has passed. */
export function isDue(dueTimes: Record<string, number>, cardId: string, now = Date.now()) {
  const due = dueTimes[cardId];
  return due === undefined || due <= now;
}

/** "10 min", "3 days", "2 weeks": what each rating would schedule next. */
export function previewIntervals(cardId: string): Record<Rating, string> {
  const current = readStates()[cardId];
  const now = Date.now();
  const label = (ms: number) => {
    const minutes = Math.round((ms - now) / 60_000);
    if (minutes < 60) return `${Math.max(1, minutes)} min`;
    const days = (ms - now) / DAY;
    if (days < 1.5) return "1 day";
    if (days < 14) return `${Math.round(days)} days`;
    if (days < 60) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };
  return {
    again: label(schedule("again", current, now).dueAt),
    good: label(schedule("good", current, now).dueAt),
    easy: label(schedule("easy", current, now).dueAt),
  };
}

/** Records a rating, reschedules the card, and syncs it when signed in. */
export function saveSRSState(id: string, rating: Rating): number {
  if (typeof window === "undefined") return Date.now();
  const states = readStates();
  const next = schedule(rating, states[id] ? { ...states[id], cardId: id } : undefined);
  next.cardId = id;
  states[id] = next;
  writeStates(states);

  if (isUserSignedIn && isSupabaseConfigured()) {
    fetch("/api/srs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId: id,
        dueAt: new Date(next.dueAt).toISOString(),
        stability: next.stability,
        difficulty: next.difficulty,
        reps: next.reps,
        updatedAt: new Date(next.updatedAt).toISOString(),
      }),
    }).catch((err) => console.error("Failed to sync review card", err));
  }
  return next.dueAt;
}
