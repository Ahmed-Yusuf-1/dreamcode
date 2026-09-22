"use client";

import { useState, useEffect, useCallback } from "react";
import { updateProfile } from "@/lib/profile";
import { track as telemetryTrack } from "@/lib/telemetry";
import { isTrackId, type TrackId } from "@/lib/catalog";

export type Track = TrackId;

const STORAGE_KEY = "dc_active_track";
const CHANGE_EVENT = "dc_track_change";

function readTrack(): Track {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isTrackId(saved) ? saved : "python";
  } catch {
    return "python";
  }
}

/**
 * The active curriculum track, persisted in localStorage, shared by every
 * component through a window event, and synced to the account when signed in.
 * `ready` turns true once the saved choice has been read on the client.
 */
export function useActiveTrack() {
  const [state, setState] = useState<{ track: Track; ready: boolean }>({ track: "python", ready: false });

  useEffect(() => {
    const apply = () => setState({ track: readTrack(), ready: true });
    const t = setTimeout(apply, 0);
    window.addEventListener(CHANGE_EVENT, apply);
    window.addEventListener("storage", apply);
    return () => {
      clearTimeout(t);
      window.removeEventListener(CHANGE_EVENT, apply);
      window.removeEventListener("storage", apply);
    };
  }, []);

  const setTrack = useCallback((next: Track) => {
    if (readTrack() === next) {
      setState({ track: next, ready: true });
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable: still switch for this page */
    }
    setState({ track: next, ready: true });
    window.dispatchEvent(new Event(CHANGE_EVENT));
    updateProfile({ activeTrack: next });
    telemetryTrack("track_switched", { track: next });
  }, []);

  return { track: state.track, ready: state.ready, setTrack };
}

/** Switches the track without a hook (e.g. when opening a lesson from another track). */
export function setActiveTrackSilently(next: Track) {
  try {
    if (localStorage.getItem(STORAGE_KEY) === next) return;
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
