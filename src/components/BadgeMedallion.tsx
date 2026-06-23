"use client";

import React from "react";
import type { BadgeIcon } from "@/lib/data";

/**
 * A collectible badge rendered as a glossy neon orb with its own glyph + accent
 * colour, so every badge on the wall is visually distinct. Found badges glow in
 * their accent; locked badges are a muted grey orb with a small padlock. The orb
 * fills its container (square), so the parent grid cell controls the size.
 */

// Stroke-based glyphs on a 24x24 grid. White stroke on a coloured orb.
const GLYPHS: Record<BadgeIcon, React.ReactNode> = {
  loop: (
    <>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </>
  ),
  bug: (
    <>
      <rect x="8" y="8" width="8" height="11" rx="4" />
      <line x1="12" y1="9" x2="12" y2="18" />
      <path d="M9 8 7 5M15 8 17 5" />
      <path d="M8 11 4 9M8 14.5 3.7 14.5M8 18 4 20M16 11 20 9M16 14.5 20.3 14.5M16 18 20 20" />
    </>
  ),
  peak: (
    <>
      <path d="M2.5 19 9 7l3.2 5.4L15.5 5 21.5 19z" />
      <path d="M7.2 13.2 9 10l1.8 3" />
    </>
  ),
  flame: (
    <path d="M12 2C9.4 5 8 7.6 8 11a4 4 0 0 0 8 0c0-1.6-.6-2.9-1.6-3.9-.2 1.5-1.1 2.4-2.1 2.4 1.1-2 .7-5-.3-7.5z" />
  ),
  blocks: (
    <>
      <rect x="3" y="13" width="7" height="7" rx="1.4" />
      <rect x="14" y="13" width="7" height="7" rx="1.4" />
      <rect x="8.5" y="3.5" width="7" height="7" rx="1.4" />
    </>
  ),
  moon: (
    <>
      <path d="M20 13.6A8 8 0 1 1 10.4 4 6.3 6.3 0 0 0 20 13.6z" />
      <path d="M17.6 3 18.3 5 20.3 5.6 18.3 6.3 17.6 8.3 17 6.3 15 5.6 17 5z" fill="currentColor" stroke="none" />
    </>
  ),
  list: (
    <>
      <line x1="8.5" y1="6" x2="21" y2="6" />
      <line x1="8.5" y1="12" x2="21" y2="12" />
      <line x1="8.5" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15.5" r="4.5" />
      <path d="M11.2 12.3 20 3.5M16.8 6.7 19.3 9.2M13.7 9.8 16.2 12.3" />
    </>
  ),
  function: (
    <>
      <path d="M9.5 4c-2.2 0-3 1-3 3 0 2 0 3-2 3 2 0 2 1 2 3 0 2 .8 3 3 3" />
      <path d="M14.5 4c2.2 0 3 1 3 3 0 2 0 3 2 3-2 0-2 1-2 3 0 2-.8 3-3 3" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6.5l-4.8 8.7A2 2 0 0 0 7 21h10a2 2 0 0 0 1.8-2.8L14 9.5V3" />
      <path d="M7.3 14.5h9.4" />
    </>
  ),
};

const LockGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ width: "62%", height: "62%" }} aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export default function BadgeMedallion({
  icon,
  accent,
  found,
  className,
  style,
}: {
  icon: BadgeIcon;
  accent: string;
  found: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const disc: React.CSSProperties = found
    ? {
        backgroundColor: accent,
        backgroundImage:
          "radial-gradient(circle at 32% 26%, rgba(255,255,255,.62), rgba(255,255,255,0) 44%), radial-gradient(circle at 72% 82%, rgba(0,0,0,.34), rgba(0,0,0,0) 54%)",
        boxShadow: `0 0 22px ${accent}77, 0 0 46px ${accent}3a, inset 0 2px 6px rgba(255,255,255,.5), inset 0 -7px 15px rgba(0,0,0,.28), 0 12px 26px rgba(20,16,60,.4)`,
        border: "1.5px solid rgba(255,255,255,.55)",
      }
    : {
        backgroundColor: "#5b5d77",
        backgroundImage:
          "radial-gradient(circle at 32% 26%, rgba(255,255,255,.2), rgba(255,255,255,0) 44%), radial-gradient(circle at 72% 82%, rgba(0,0,0,.32), rgba(0,0,0,0) 54%)",
        boxShadow: "inset 0 2px 6px rgba(255,255,255,.16), inset 0 -7px 15px rgba(0,0,0,.3), 0 8px 18px rgba(20,16,60,.3)",
        border: "1.5px solid rgba(255,255,255,.2)",
      };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        ...disc,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={found ? "#ffffff" : "rgba(255,255,255,.62)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          width: "52%",
          height: "52%",
          filter: found ? "drop-shadow(0 1px 2px rgba(0,0,0,.38))" : "none",
        }}
        aria-hidden="true"
      >
        {GLYPHS[icon]}
      </svg>

      {!found && (
        <div
          style={{
            position: "absolute",
            right: "-4%",
            bottom: "-4%",
            width: "34%",
            height: "34%",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: "rgba(28,18,52,.92)",
            color: "rgba(255,255,255,.8)",
            border: "1.5px solid rgba(255,255,255,.3)",
            boxShadow: "0 4px 10px rgba(0,0,0,.35)",
          }}
        >
          {LockGlyph}
        </div>
      )}
    </div>
  );
}
