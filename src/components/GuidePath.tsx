"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useActiveTrack } from "@/lib/track";
import { useUserProfile } from "@/lib/profile";
import { getModules, getNextLesson, type Lesson } from "@/lib/curriculum";
import { practiceDatasets } from "@/lib/data";

/**
 * A gentle, dismissible coach that strings the four phases - Learn, Practice,
 * Challenge, Build - into one flowing path for new learners. It always names the
 * single next thing to do (and links to it), with a tip for whatever page they are
 * on, so a first-timer is guided from lesson 1 through their first loop of the
 * cycle. It hides itself once the learner has a few stops under their belt, or as
 * soon as they dismiss it (they clearly know their way around).
 */

const PHASES = ["Learn", "Practice", "Challenge", "Build"] as const;
type Phase = (typeof PHASES)[number];
const DISMISS_KEY = "dc_guide_dismissed";
const GRADUATE_AFTER = 6; // completed stops; past this the learner has the rhythm

function isGuidedRoute(p: string): boolean {
  return (
    p === "/dashboard" ||
    p === "/journey" ||
    p === "/lessons" ||
    p.startsWith("/lesson/") ||
    p.startsWith("/practice/") ||
    p.startsWith("/challenge/") ||
    p.startsWith("/project/")
  );
}

export default function GuidePath() {
  const pathname = usePathname() || "/";
  const { track } = useActiveTrack();
  const { profile } = useUserProfile();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Deferred (matches the app's effect convention) so reading localStorage does
    // not fire a synchronous setState inside the effect.
    const t = setTimeout(() => {
      setMounted(true);
      try {
        setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted || dismissed || !isGuidedRoute(pathname)) return null;

  const completed = profile.completedStops || [];
  if (completed.length >= GRADUATE_AFTER) return null;

  const trackLessons: Lesson[] = getModules(track).flatMap((m) => m.lessons);
  if (trackLessons.length === 0) return null;
  const nextLesson = getNextLesson(track, completed) || trackLessons[0];

  let phase: Phase = "Learn";
  let tip = "";
  let ctaLabel = "";
  let ctaHref = `/lesson/${nextLesson.slug}`;

  if (pathname.startsWith("/lesson/")) {
    phase = "Learn";
    tip = "Read the idea, type in the editor, then press Run to watch it work. When it clicks, take the next step.";
    const slug = pathname.split("/")[2];
    const lesson = trackLessons.find((l) => l.slug === slug);
    if (lesson?.practiceSlug && practiceDatasets[lesson.practiceSlug]) {
      phase = "Practice";
      ctaLabel = "Practice what you just learned";
      ctaHref = `/practice/${lesson.practiceSlug}`;
    } else {
      ctaLabel = `Next lesson: ${nextLesson.catalogTitle}`;
    }
  } else if (pathname.startsWith("/practice/")) {
    phase = "Practice";
    tip = "Arrange the pieces, fill the fading blanks, and predict the output. That is how it sticks.";
    ctaLabel = `Next lesson: ${nextLesson.catalogTitle}`;
  } else if (pathname.startsWith("/challenge/")) {
    phase = "Challenge";
    tip = "Write the function, then Run the tests. All green means you have truly got it.";
    ctaLabel = "Back to your path";
  } else if (pathname.startsWith("/project/")) {
    phase = "Build";
    tip = "Put the pieces together into something real. This is where it all pays off.";
    ctaLabel = "Back to your path";
  } else {
    phase = "Learn";
    tip = "Four small moves, on repeat: learn an idea, practice it, beat a challenge, then build. Start here.";
    ctaLabel = completed.length === 0 ? `Start lesson 1: ${nextLesson.catalogTitle}` : `Continue: ${nextLesson.catalogTitle}`;
  }

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <div className="fixed z-40" style={{ left: 18, bottom: 18, width: "min(320px, calc(100vw - 36px))" }}>
      <div
        className="backdrop-blur-lg"
        style={{
          background: "rgba(20,17,60,.92)",
          border: "1px solid rgba(255,255,255,.18)",
          borderRadius: 18,
          padding: "16px 16px 14px",
          boxShadow: "0 0 30px rgba(189,128,255,.22), 0 20px 50px rgba(8,6,30,.5)",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 11 }}>
          <span className="font-display" style={{ fontWeight: 800, fontSize: 12, letterSpacing: 1.2, color: "#ffd9ef" }}>
            YOUR GUIDED PATH
          </span>
          <button
            onClick={dismiss}
            aria-label="Dismiss the guide"
            className="flex cursor-pointer items-center justify-center transition-colors hover:bg-white/25"
            style={{ background: "rgba(255,255,255,.12)", border: "none", color: "#fff", width: 22, height: 22, borderRadius: 999, fontSize: 14, lineHeight: 1 }}
          >
            {"×"}
          </button>
        </div>

        <div className="flex items-center" style={{ gap: 3, marginBottom: 12 }}>
          {PHASES.map((p, i) => {
            const active = p === phase;
            return (
              <div key={p} className="flex items-center" style={{ gap: 3 }}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 900,
                    color: active ? "#ffffff" : "rgba(255,255,255,.45)",
                    background: active ? "linear-gradient(135deg,#ff7ad9,#ff4fb0)" : "transparent",
                    padding: active ? "3px 9px" : "3px 0",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p}
                </span>
                {i < PHASES.length - 1 && <span style={{ color: "rgba(255,255,255,.35)", fontSize: 9 }}>{"→"}</span>}
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.88)", lineHeight: 1.5, margin: "0 0 12px" }}>{tip}</p>

        <Link
          href={ctaHref}
          className="font-display block cursor-pointer text-center transition-transform hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg,#ff7ad9,#ff4fb0)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 13.5,
            padding: "11px 16px",
            borderRadius: 999,
            boxShadow: "0 0 18px rgba(255,100,200,.5)",
          }}
        >
          {ctaLabel} {"→"}
        </Link>
      </div>
    </div>
  );
}
