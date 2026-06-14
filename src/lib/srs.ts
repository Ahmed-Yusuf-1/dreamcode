"use client";

export interface ReviewCardState {
  id: string;
  dueAt: number; // timestamp in ms
}

const DEFAULT_DUE = [
  { id: "r1", offsetHours: 0 },
  { id: "r2", offsetHours: 0 },
  { id: "r3", offsetHours: 0 },
  { id: "r4", offsetHours: 12 }, // due in 12 hours (due today)
];

export function getSRSStates(): Record<string, number> {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem("dc_srs_states");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  // Initialize
  const initial: Record<string, number> = {};
  const now = Date.now();
  DEFAULT_DUE.forEach(({ id, offsetHours }) => {
    initial[id] = now + offsetHours * 3600 * 1000;
  });
  localStorage.setItem("dc_srs_states", JSON.stringify(initial));
  return initial;
}

export function saveSRSState(id: string, nextDueAt: number) {
  if (typeof window === "undefined") return;
  const states = getSRSStates();
  states[id] = nextDueAt;
  localStorage.setItem("dc_srs_states", JSON.stringify(states));
  // Dispatch event so dashboard count updates concurrently
  window.dispatchEvent(new Event("dc_srs_change"));
}
