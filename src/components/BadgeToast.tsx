"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import BadgeMedallion from "@/components/BadgeMedallion";
import { useCatalog } from "@/components/CatalogProvider";
import { RARITY } from "@/lib/badges";
import { BADGE_UNLOCK_EVENT } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import type { Badge } from "@/content/types";

const SHOW_MS = 6000;

/**
 * The moment a badge is earned. Mounted once for the whole app: any page that
 * completes an activity fires the unlock event, and the badge arrives here.
 * Several at once queue up, rarest first, so a legendary is never buried.
 */
export default function BadgeToast() {
  const catalog = useCatalog();
  const [queue, setQueue] = useState<Badge[]>([]);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = useCallback(() => {
    setLeaving(true);
    timers.current.push(
      setTimeout(() => {
        setLeaving(false);
        setQueue((rest) => rest.slice(1));
      }, 220),
    );
  }, []);

  useEffect(() => {
    const byId = new Map(catalog.badges.map((b) => [b.id, b]));
    const onUnlock = (event: Event) => {
      const ids = (event as CustomEvent<string[]>).detail;
      if (!Array.isArray(ids) || ids.length === 0) return;
      const earned = ids
        .map((id) => byId.get(id))
        .filter((b): b is Badge => !!b)
        .sort((a, b) => RARITY[b.rarity].order - RARITY[a.rarity].order);
      if (earned.length === 0) return;
      setQueue((current) => [...current, ...earned.filter((b) => !current.some((q) => q.id === b.id))]);
      playChime("badge");
    };
    window.addEventListener(BADGE_UNLOCK_EVENT, onUnlock);
    return () => window.removeEventListener(BADGE_UNLOCK_EVENT, onUnlock);
  }, [catalog.badges]);

  const badge = queue[0];

  useEffect(() => {
    if (!badge) return;
    const timer = setTimeout(dismiss, SHOW_MS);
    return () => clearTimeout(timer);
  }, [badge, dismiss]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  if (!badge) return null;
  const rarity = RARITY[badge.rarity];

  return (
    <div
      role="status"
      aria-live="polite"
      className="anim-pop-in"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 26,
        transform: `translateX(-50%) translateY(${leaving ? "14px" : "0"})`,
        opacity: leaving ? 0 : 1,
        transition: "opacity .2s ease, transform .2s ease",
        zIndex: 70,
        width: "min(380px, calc(100vw - 32px))",
      }}
    >
      <div
        className="dc-glass flex items-center"
        style={{
          gap: 14,
          padding: "14px 16px",
          borderRadius: 20,
          border: `1px solid ${rarity.ring}`,
          boxShadow: `0 0 26px ${rarity.ring}55, var(--dc-card-shadow)`,
        }}
      >
        <div style={{ width: 56, flexShrink: 0 }}>
          <BadgeMedallion icon={badge.icon} accent={badge.accent} found ring={rarity.ring} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="dc-kicker" style={{ color: rarity.ring }}>
            {rarity.label} badge earned {"·"} +{rarity.xp} XP
          </div>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 19, lineHeight: 1.2 }}>
            {badge.name}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--dc-on-sky-soft)" }}>{badge.desc}</div>
          <Link href="/badges" className="font-display" style={{ fontSize: 13, fontWeight: 800, color: "var(--dc-link)" }} onClick={dismiss}>
            Wear it {"→"}
          </Link>
        </div>
        <button type="button" onClick={dismiss} aria-label="Dismiss" className="dc-pill" style={{ flexShrink: 0, padding: "4px 10px", fontSize: 12 }}>
          {"×"}
        </button>
      </div>
      {queue.length > 1 && (
        <div className="text-center" style={{ fontSize: 12, fontWeight: 800, color: "var(--dc-on-sky-muted)", marginTop: 6 }}>
          and {queue.length - 1} more
        </div>
      )}
    </div>
  );
}
