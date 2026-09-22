"use client";

import { TRACKS, type TrackId } from "@/lib/catalog";
import { useActiveTrack } from "@/lib/track";

/**
 * Switches the active track everywhere (lessons, journey, peaks, projects,
 * dashboard, review). The selection persists and syncs to the account.
 */
export default function TrackPicker({
  only,
  label = "Choose a language track",
  onChange,
}: {
  only?: TrackId[];
  label?: string;
  onChange?: (track: TrackId) => void;
}) {
  const { track, setTrack } = useActiveTrack();
  const options = only ? TRACKS.filter((t) => only.includes(t.id)) : TRACKS;
  return (
    <div className="dc-segmented" role="group" aria-label={label}>
      {options.map((t) => (
        <button
          key={t.id}
          type="button"
          className="dc-segmented__option"
          aria-pressed={track === t.id}
          onClick={() => {
            setTrack(t.id);
            onChange?.(t.id);
          }}
        >
          {t.label}
          {t.runtime === "quiz" && (
            <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.75, letterSpacing: 0.6 }}>QUIZ</span>
          )}
        </button>
      ))}
    </div>
  );
}
