"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface ReviewCardState {
  id: string;
  dueAt: number; // timestamp in ms
}

export interface FSRSCardState {
  cardId: string;
  dueAt: number;      // timestamp in ms
  stability: number;  // stability in days
  difficulty: number; // difficulty 1..10
  reps: number;
  updatedAt: number;  // timestamp in ms
}

const DEFAULT_DUE = [
  { id: "r1", offsetHours: 0 },
  { id: "r2", offsetHours: 0 },
  { id: "r3", offsetHours: 0 },
  { id: "r4", offsetHours: 12 }, // due in 12 hours (due today)
];

let isUserSignedIn = false;
let supabase: ReturnType<typeof createClient> | null = null;

if (typeof window !== "undefined" && isSupabaseConfigured()) {
  supabase = createClient();
  // Check active session on startup
  supabase.auth.getSession().then(({ data }) => {
    isUserSignedIn = !!data.session;
    if (isUserSignedIn) {
      syncSrsFromApi();
    }
  });
  // Listen to auth status changes
  supabase.auth.onAuthStateChange((_event, session) => {
    isUserSignedIn = !!session;
    if (isUserSignedIn) {
      syncSrsFromApi();
    }
  });
}

/** Synchronizes the client SRS cache with the database. */
async function syncSrsFromApi() {
  try {
    const res = await fetch("/api/srs");
    if (res.ok) {
      const data = await res.json();
      if (data.cards && Array.isArray(data.cards)) {
        const fullStates: Record<string, FSRSCardState> = {};
        data.cards.forEach((card: any) => {
          fullStates[card.cardId] = {
            cardId: card.cardId,
            dueAt: new Date(card.dueAt).getTime(),
            stability: card.stability,
            difficulty: card.difficulty,
            reps: card.reps,
            updatedAt: card.updatedAt ? new Date(card.updatedAt).getTime() : Date.now(),
          };
        });
        localStorage.setItem("dc_srs_full_states", JSON.stringify(fullStates));
        window.dispatchEvent(new Event("dc_srs_change"));
      }
    }
  } catch (e) {
    console.error("Failed to sync SRS from API", e);
  }
}

/**
  * Core FSRS scheduler implementation.
  * Calculates difficulty, stability, and retrievability.
  */
function calculateFSRS(
  rating: "again" | "good" | "easy",
  currentCard?: FSRSCardState
): FSRSCardState {
  const now = Date.now();
  
  if (!currentCard || currentCard.reps === 0) {
    // Initial review (first time seeing the card)
    let stability = 2.4;
    let difficulty = 4.93;
    
    if (rating === "again") {
      stability = 0.4;
      difficulty = 6.81;
    } else if (rating === "good") {
      stability = 2.4;
      difficulty = 4.93;
    } else if (rating === "easy") {
      stability = 5.8;
      difficulty = 3.99;
    }
    
    // For 'again', we review it in 1 minute in the same session, but set stability S = 0.4 days
    const dueAt = rating === "again" 
      ? now + 60 * 1000 
      : now + stability * 24 * 3600 * 1000;
      
    return {
      cardId: "",
      dueAt,
      stability,
      difficulty,
      reps: 1,
      updatedAt: now,
    };
  }

  // Subsequent review: calculate elapsed time in days
  const t = Math.max(0.01, (now - currentCard.updatedAt) / (24 * 3600 * 1000));
  const R = Math.pow(0.9, t / currentCard.stability);
  
  let difficulty = currentCard.difficulty;
  let stability = currentCard.stability;
  
  if (rating === "again") {
    difficulty = Math.max(1, Math.min(10, currentCard.difficulty + 0.86));
    const Sf = 2.18 * Math.pow(difficulty, -0.05) * (Math.pow(currentCard.stability + 1, 0.34) - 1) * Math.exp(0.34 * (1 - R));
    stability = Math.max(0.1, Math.min(Sf, currentCard.stability * 0.5, 0.4));
  } else if (rating === "good") {
    difficulty = Math.max(1, Math.min(10, currentCard.difficulty));
    const factor = 1 + Math.exp(1.49) * (11 - difficulty) * Math.pow(currentCard.stability, -0.14) * (Math.exp((1 - R) * 0.94) - 1);
    stability = currentCard.stability * factor;
  } else if (rating === "easy") {
    difficulty = Math.max(1, Math.min(10, currentCard.difficulty - 0.94));
    const factor = 1 + Math.exp(1.49) * (11 - difficulty) * Math.pow(currentCard.stability, -0.14) * (Math.exp((1 - R) * 0.94) - 1);
    stability = currentCard.stability * factor * 1.26;
  }
  
  const dueAt = rating === "again"
    ? now + 60 * 1000 // due in 1 min
    : now + stability * 24 * 3600 * 1000;
    
  return {
    cardId: currentCard.cardId,
    dueAt,
    stability,
    difficulty,
    reps: currentCard.reps + 1,
    updatedAt: now,
  };
}

export function getSRSStates(): Record<string, number> {
  if (typeof window === "undefined") return {};
  
  // 1. Try to load new FSRS states
  const saved = localStorage.getItem("dc_srs_full_states");
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Record<string, FSRSCardState>;
      const result: Record<string, number> = {};
      Object.keys(parsed).forEach((key) => {
        result[key] = parsed[key].dueAt;
      });
      return result;
    } catch {
      // ignore and fall through
    }
  }

  // 2. Try to migrate from legacy simple scheduler structure
  const oldSaved = localStorage.getItem("dc_srs_states");
  if (oldSaved) {
    try {
      const oldParsed = JSON.parse(oldSaved);
      const migrated: Record<string, FSRSCardState> = {};
      const now = Date.now();
      Object.keys(oldParsed).forEach((key) => {
        migrated[key] = {
          cardId: key,
          dueAt: Number(oldParsed[key]),
          stability: 2.4,
          difficulty: 4.93,
          reps: 0,
          updatedAt: now,
        };
      });
      localStorage.setItem("dc_srs_full_states", JSON.stringify(migrated));
      localStorage.removeItem("dc_srs_states");
      
      const result: Record<string, number> = {};
      Object.keys(oldParsed).forEach((key) => {
        result[key] = Number(oldParsed[key]);
      });
      return result;
    } catch {
      // ignore
    }
  }

  // 3. Fallback to initialize defaults
  const initial: Record<string, FSRSCardState> = {};
  const now = Date.now();
  DEFAULT_DUE.forEach(({ id, offsetHours }) => {
    initial[id] = {
      cardId: id,
      dueAt: now + offsetHours * 3600 * 1000,
      stability: 2.4,
      difficulty: 4.93,
      reps: 0,
      updatedAt: now,
    };
  });
  localStorage.setItem("dc_srs_full_states", JSON.stringify(initial));
  
  const result: Record<string, number> = {};
  DEFAULT_DUE.forEach(({ id, offsetHours }) => {
    result[id] = now + offsetHours * 3600 * 1000;
  });
  return result;
}

/** Saves card review state, calculates new FSRS parameters, and syncs to API in background. */
export function saveSRSState(id: string, rating: "again" | "good" | "easy"): number {
  if (typeof window === "undefined") return Date.now();
  
  let fullStates: Record<string, FSRSCardState> = {};
  const saved = localStorage.getItem("dc_srs_full_states");
  if (saved) {
    try {
      fullStates = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  const currentCard = fullStates[id] || {
    cardId: id,
    dueAt: Date.now(),
    stability: 2.4,
    difficulty: 4.93,
    reps: 0,
    updatedAt: Date.now(),
  };

  const newCard = calculateFSRS(rating, currentCard);
  newCard.cardId = id;
  fullStates[id] = newCard;

  localStorage.setItem("dc_srs_full_states", JSON.stringify(fullStates));

  // Dispatch event so dashboard count updates concurrently
  window.dispatchEvent(new Event("dc_srs_change"));

  // If signed in, sync to backend
  if (isUserSignedIn && isSupabaseConfigured()) {
    fetch("/api/srs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardId: id,
        dueAt: new Date(newCard.dueAt).toISOString(),
        stability: newCard.stability,
        difficulty: newCard.difficulty,
        reps: newCard.reps,
        updatedAt: new Date(newCard.updatedAt).toISOString(),
      }),
    }).catch((err) => console.error("Failed to sync SRS card to API", err));
  }

  return newCard.dueAt;
}
