"use client";

import { useState, useEffect } from "react";
import { updateProfile } from "@/lib/profile";
import { track as telemetryTrack } from "@/lib/telemetry";

export type Track = "python" | "javascript" | "csharp" | "typescript";

const TRACKS: Track[] = ["python", "javascript", "csharp", "typescript"];
const isTrack = (v: unknown): v is Track => TRACKS.includes(v as Track);

/**
 * Persists and synchronizes the active curriculum track (Python vs JavaScript)
 * across the frontend client using localStorage and custom event triggers.
 * Syncs the selection to the database user settings when logged in.
 */
export function useActiveTrack() {
  const [track, setTrack] = useState<Track>("python");

  useEffect(() => {
    const saved = localStorage.getItem("dc_active_track");
    if (isTrack(saved)) {
      setTimeout(() => {
        setTrack(saved);
      }, 0);
    }
  }, []);

  const changeTrack = (newTrack: Track) => {
    setTrack(newTrack);
    localStorage.setItem("dc_active_track", newTrack);
    // Dispatch global event so all components update concurrently
    window.dispatchEvent(new Event("dc_track_change"));

    // Sync with the backend user profile settings
    try {
      updateProfile({
        activeTrack: newTrack,
      });
    } catch (e) {
      console.error("Failed to sync track selection to backend", e);
    }
    telemetryTrack("track_switched", { track: newTrack });
  };

  useEffect(() => {
    const handleEvent = () => {
      const saved = localStorage.getItem("dc_active_track");
      if (isTrack(saved)) {
        setTrack(saved);
      }
    };
    window.addEventListener("dc_track_change", handleEvent);
    return () => window.removeEventListener("dc_track_change", handleEvent);
  }, []);

  return { track, setTrack: changeTrack };
}
