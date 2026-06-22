"use client";

import Link from "next/link";
import { useActiveTrack } from "@/lib/track";
import { useUserProfile, useIsSignedIn } from "@/lib/profile";
import { getNextLesson } from "@/lib/curriculum";

/**
 * Auth + progress aware calls to action. A guest is invited to start; a signed-in
 * learner is sent to their NEXT lesson (the first they have not finished), so a
 * brand-new account always begins at lesson 1 and never lands mid-curriculum, while
 * returning learners continue where they left off. These are client components so
 * the otherwise-static marketing pages can react to the session.
 */
function useNextLesson() {
  const { track } = useActiveTrack();
  const { profile } = useUserProfile();
  const completed = profile.completedStops || [];
  const next = getNextLesson(track, completed);
  return { next, hasProgress: completed.length > 0 };
}

const PRIMARY: React.CSSProperties = {
  border: "none",
  background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: 18,
  padding: "15px 34px",
  borderRadius: 999,
  boxShadow: "0 0 28px rgba(255,100,200,.7), 0 18px 40px rgba(40,16,60,.45)",
};
const PRIMARY_CLASS = "font-display cursor-pointer transition-transform hover:-translate-y-[3px] hover:scale-[1.02]";

/** Hero primary button: "Start here" for guests, "Continue learning" for members. */
export function HeroStartCta() {
  const signedIn = useIsSignedIn();
  const { next } = useNextLesson();
  if (signedIn && next) {
    return (
      <Link href={`/lesson/${next.slug}`} className={PRIMARY_CLASS} style={PRIMARY}>
        Continue learning
      </Link>
    );
  }
  return (
    <Link href="/start" className={PRIMARY_CLASS} style={PRIMARY}>
      Start here
    </Link>
  );
}

/** Final call to action: "Start free" for guests, dashboard for members. */
export function FinalStartCta() {
  const signedIn = useIsSignedIn();
  const style: React.CSSProperties = {
    ...PRIMARY,
    padding: "15px 36px",
    boxShadow: "0 0 30px rgba(255,100,200,.7), 0 18px 40px rgba(20,10,50,.5)",
  };
  if (signedIn) {
    return (
      <Link href="/dashboard" className={PRIMARY_CLASS} style={style}>
        Back to your dashboard {"→"}
      </Link>
    );
  }
  return (
    <Link href="/signup" className={PRIMARY_CLASS} style={style}>
      Start free tonight {"→"}
    </Link>
  );
}

/** The floating hero card: a guest sees "begin at lesson 1", a member sees their
 *  real next lesson. Never a hardcoded mid-curriculum stop. */
export function ContinueCard() {
  const signedIn = useIsSignedIn();
  const { next } = useNextLesson();
  const href = signedIn && next ? `/lesson/${next.slug}` : "/start";
  const kicker = signedIn ? "CONTINUE" : "BEGIN";
  const label = next ? `${next.catalogTitle} · Lesson ${next.order} →` : `Start →`;
  return (
    <Link
      href={href}
      className="dc-side-float absolute z-6 cursor-pointer backdrop-blur-lg transition-colors hover:bg-white/26"
      style={{
        left: "7%",
        bottom: "22%",
        animation: "floatySm 8s ease-in-out .5s infinite",
        background: "rgba(255,255,255,.14)",
        border: "1px solid rgba(255,255,255,.45)",
        borderRadius: 18,
        padding: "14px 18px",
        boxShadow: "0 14px 34px rgba(20,16,50,.35)",
        textAlign: "left",
        display: "block",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: "#ffd9ef", textShadow: "0 0 10px rgba(255,138,222,.7)" }}>
        {kicker}
      </div>
      <div className="font-display" style={{ fontWeight: 800, fontSize: 17, color: "#ffffff", marginTop: 3, textShadow: "0 1px 10px rgba(20,16,50,.6)" }}>
        {label}
      </div>
    </Link>
  );
}

/** The /start onboarding button: routes to the learner's actual first/next lesson. */
export function StartFirstLessonButton() {
  const { next, hasProgress } = useNextLesson();
  const href = next ? `/lesson/${next.slug}` : "/lessons";
  return (
    <Link
      href={href}
      className="font-display cursor-pointer transition-transform hover:-translate-y-[3px] hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
        color: "#ffffff",
        fontWeight: 800,
        fontSize: 19,
        padding: "16px 40px",
        borderRadius: 999,
        boxShadow: "0 0 30px rgba(255,100,200,.7), 0 18px 40px rgba(20,10,50,.5)",
      }}
    >
      {hasProgress ? "Continue your journey" : "Start your first lesson"}
    </Link>
  );
}
