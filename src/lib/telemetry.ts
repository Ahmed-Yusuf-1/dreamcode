"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Lightweight product analytics. Call `track(name, props)` from anywhere - it is
 * always safe (never throws, never blocks) and no-ops when Supabase is not
 * configured or the user is signed out. Events are queued client-side and flushed
 * to `/api/events` in batches (on a short timer, when the batch fills, and on page
 * hide via sendBeacon), so a single action never costs a network round trip.
 */

interface QueuedEvent {
  name: string;
  props?: Record<string, unknown>;
}

const FLUSH_DELAY_MS = 4000;
const BATCH_SIZE = 20;
const MAX_QUEUE = 100; // bound memory if signed out or the endpoint is failing

let signedIn = false;
let supabase: ReturnType<typeof createClient> | null = null;
const queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

if (typeof window !== "undefined" && isSupabaseConfigured()) {
  supabase = createClient();
  supabase.auth.getSession().then(({ data }) => {
    signedIn = !!data.session;
    if (signedIn) scheduleFlush();
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    signedIn = !!session;
    if (signedIn) scheduleFlush();
  });
  // sendBeacon survives the page unload, so flush whatever is queued on the way out.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });
  window.addEventListener("pagehide", () => flush(true));
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_DELAY_MS);
}

function requeue(batch: QueuedEvent[]) {
  queue.unshift(...batch);
  if (queue.length > MAX_QUEUE) queue.splice(0, queue.length - MAX_QUEUE);
}

async function flush(useBeacon = false) {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!isSupabaseConfigured() || !signedIn || queue.length === 0) return;

  const batch = queue.splice(0, queue.length);
  const body = JSON.stringify({ events: batch });

  try {
    if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
      const ok = navigator.sendBeacon(
        "/api/events",
        new Blob([body], { type: "application/json" }),
      );
      if (!ok) requeue(batch);
      return;
    }
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: useBeacon,
    });
    if (!res.ok) requeue(batch);
  } catch {
    requeue(batch);
  }
}

/** Records a telemetry event. Safe everywhere; no-op when unconfigured/signed out. */
export function track(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined" || !isSupabaseConfigured()) return;
  queue.push({ name, props });
  if (queue.length > MAX_QUEUE) queue.shift();
  if (queue.length >= BATCH_SIZE) void flush();
  else scheduleFlush();
}
