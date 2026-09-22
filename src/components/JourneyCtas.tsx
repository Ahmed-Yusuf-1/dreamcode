"use client";

import Link from "next/link";
import { useActiveTrack } from "@/lib/track";
import { useIsSignedIn, useUserProfile } from "@/lib/profile";
import { nextLessonFor } from "@/lib/catalog";
import { useCatalog } from "@/components/CatalogProvider";

/**
 * Progress-aware calls to action for the marketing pages. Anyone with progress
 * (guest or signed in) is sent to the first lesson they have not finished in
 * their active track; a brand-new visitor starts at the beginning.
 */
function useNextLesson() {
  const catalog = useCatalog();
  const { track } = useActiveTrack();
  const { profile, ready } = useUserProfile();
  const completed = profile.completedStops || [];
  return { next: nextLessonFor(catalog, track, completed), hasProgress: ready && completed.length > 0 };
}

/** Hero primary button: "Start here" for new visitors, "Continue learning" after that. */
export function HeroStartCta() {
  const { next, hasProgress } = useNextLesson();
  if (hasProgress && next) {
    return (
      <Link href={`/lesson/${next.slug}`} className="dc-btn dc-btn--primary dc-btn--lg">
        Continue learning
      </Link>
    );
  }
  return (
    <Link href="/start" className="dc-btn dc-btn--primary dc-btn--lg">
      Start here
    </Link>
  );
}

/** Final call to action: sign up for guests, the dashboard for members. */
export function FinalStartCta() {
  const signedIn = useIsSignedIn();
  return signedIn ? (
    <Link href="/dashboard" className="dc-btn dc-btn--primary dc-btn--lg">
      Back to your dashboard {"→"}
    </Link>
  ) : (
    <Link href="/signup" className="dc-btn dc-btn--primary dc-btn--lg">
      Start free tonight {"→"}
    </Link>
  );
}

/** The floating hero card: begin at lesson 1, or continue from the real next lesson. */
export function ContinueCard() {
  const { next, hasProgress } = useNextLesson();
  const href = hasProgress && next ? `/lesson/${next.slug}` : "/start";
  return (
    <Link
      href={href}
      className="dc-side-float dc-glass dc-depth-card dc-depth-card--interactive absolute z-6 block"
      style={{ left: "7%", bottom: "24%", padding: "14px 18px", borderRadius: 18, animation: "floatySm 8s ease-in-out .5s infinite" }}
    >
      <div className="dc-kicker">{hasProgress ? "Continue" : "Begin"}</div>
      <div className="font-display" style={{ fontWeight: 800, fontSize: 17, marginTop: 3 }}>
        {next ? `${next.catalogTitle} · Lesson ${next.order} →` : "Start →"}
      </div>
    </Link>
  );
}

/** The /start onboarding button: routes to the learner's actual first/next lesson. */
export function StartFirstLessonButton() {
  const { next, hasProgress } = useNextLesson();
  return (
    <Link href={next ? `/lesson/${next.slug}` : "/lessons"} className="dc-btn dc-btn--primary dc-btn--lg">
      {hasProgress ? "Continue your journey" : "Start your first lesson"}
    </Link>
  );
}
