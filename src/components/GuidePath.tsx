"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useActiveTrack } from "@/lib/track";
import { useUserProfile } from "@/lib/profile";
import { nextLessonFor } from "@/lib/catalog";
import { useCatalog } from "@/components/CatalogProvider";

/**
 * A gentle, dismissible coach for new learners on the hub pages. It names the
 * four moves (Learn, Practice, Challenge, Build) and always offers the single
 * next lesson. It starts as a small pill so it never covers content, expands on
 * tap, graduates once the learner has a few stops done, and hides for good when
 * dismissed. Focused pages (lessons, drills, editors) carry their own guidance.
 */

const PHASES = ["Learn", "Practice", "Challenge", "Build"] as const;
const DISMISS_KEY = "dc_guide_dismissed";
const GRADUATE_AFTER = 6;
const HUB_ROUTES = new Set(["/dashboard", "/journey", "/lessons"]);

export default function GuidePath() {
  const pathname = usePathname() || "/";
  const catalog = useCatalog();
  const { track } = useActiveTrack();
  const { profile, ready } = useUserProfile();
  const [dismissed, setDismissed] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
      } catch {
        setDismissed(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!ready || dismissed || !HUB_ROUTES.has(pathname)) return null;
  const completed = profile.completedStops || [];
  if (completed.length >= GRADUATE_AFTER) return null;
  const next = nextLessonFor(catalog, track, completed);
  if (!next) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  const cta = completed.length === 0 ? `Start lesson 1: ${next.catalogTitle}` : `Continue: ${next.catalogTitle}`;

  return (
    <div className="fixed z-40" style={{ left: 16, bottom: 16, width: open ? "min(320px, calc(100vw - 32px))" : "auto" }}>
      {!open ? (
        <div className="flex items-center" style={{ gap: 6 }}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            aria-controls="guide-path-panel"
            className="dc-pill"
            style={{ background: "var(--dc-menu-bg)", borderColor: "rgba(255,255,255,.3)" }}
          >
            <span className="dc-kicker" style={{ fontSize: 10 }}>Guided path</span>
            <span>Next: {next.catalogTitle}</span>
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss the guided path"
            className="dc-pill"
            style={{ background: "var(--dc-menu-bg)", borderColor: "rgba(255,255,255,.3)", padding: "8px 11px" }}
          >
            {"×"}
          </button>
        </div>
      ) : (
        <div
          id="guide-path-panel"
          className="anim-pop-in"
          style={{
            background: "var(--dc-menu-bg)",
            border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 18,
            padding: "16px 16px 14px",
            boxShadow: "0 20px 50px rgba(8,6,30,.5)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 11 }}>
            <span className="dc-kicker">Your guided path</span>
            <div className="flex" style={{ gap: 6 }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Collapse the guided path"
                className="flex cursor-pointer items-center justify-center"
                style={iconButton}
              >
                {"\u25BE"}
              </button>
              <button type="button" onClick={dismiss} aria-label="Dismiss the guided path" className="flex cursor-pointer items-center justify-center" style={iconButton}>
                {"×"}
              </button>
            </div>
          </div>
          <ol className="flex flex-wrap items-center" style={{ gap: 4, marginBottom: 12, listStyle: "none", padding: 0 }}>
            {PHASES.map((p, i) => (
              <li key={p} className="flex items-center" style={{ gap: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: i === 0 ? "#ffffff" : "rgba(255,255,255,.55)",
                    background: i === 0 ? "var(--dc-accent)" : "transparent",
                    padding: i === 0 ? "3px 9px" : "3px 0",
                    borderRadius: 999,
                  }}
                >
                  {p}
                </span>
                {i < PHASES.length - 1 && <span style={{ color: "rgba(255,255,255,.35)", fontSize: 9 }}>{"→"}</span>}
              </li>
            ))}
          </ol>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.88)", lineHeight: 1.55, margin: "0 0 12px" }}>
            Four small moves on repeat: learn an idea and run it, practice it three ways, beat a graded challenge, then build a project.
          </p>
          <Link href={`/lesson/${next.slug}`} className="dc-btn dc-btn--primary dc-btn--sm dc-btn--block">
            {cta} {"→"}
          </Link>
        </div>
      )}
    </div>
  );
}

const iconButton: React.CSSProperties = {
  background: "rgba(255,255,255,.12)",
  border: "none",
  color: "#fff",
  width: 24,
  height: 24,
  borderRadius: 999,
  fontSize: 14,
  lineHeight: 1,
};
