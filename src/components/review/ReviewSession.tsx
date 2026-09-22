"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import FlowBar from "@/components/ui/FlowBar";
import TrackPicker from "@/components/ui/TrackPicker";
import { cloudOpacity } from "@/lib/theme";
import type { ReviewCardData } from "@/lib/review";
import { getSRSStates, isDue, previewIntervals, saveSRSState, SRS_CHANGE_EVENT, type Rating } from "@/lib/srs";
import { completeActivity, useUserProfile } from "@/lib/profile";
import { useActiveTrack } from "@/lib/track";
import { playChime } from "@/lib/sound";
import { track } from "@/lib/telemetry";
import { nextLessonFor, trackLabel } from "@/lib/catalog";
import { useCatalog } from "@/components/CatalogProvider";

function localToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/**
 * One review sitting. Normal mode walks every due card for the active track
 * (FSRS decides what is due). Chapter mode, reached from the end of a chapter,
 * reviews every lesson of that chapter right away. "Again" sends a card to the
 * back of the queue so it comes round once more before the sitting ends.
 */
export default function ReviewSession({
  bank,
  chapter,
}: {
  bank: ReviewCardData[];
  chapter: { module: string; fromLesson: string } | null;
}) {
  const catalog = useCatalog();
  const { track: activeTrack, ready: trackReady } = useActiveTrack();
  const { profile, ready } = useUserProfile();
  const [dueTimes, setDueTimes] = useState<Record<string, number> | null>(null);
  const [loadedAt, setLoadedAt] = useState(0);
  const [queue, setQueue] = useState<ReviewCardData[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [earned, setEarned] = useState<number | null>(null);
  const [practiceAll, setPracticeAll] = useState(false);
  const awarded = useRef(false);

  useEffect(() => {
    const load = () => {
      setDueTimes(getSRSStates());
      setLoadedAt(Date.now());
    };
    const t = setTimeout(load, 0);
    window.addEventListener(SRS_CHANGE_EVENT, load);
    return () => {
      clearTimeout(t);
      window.removeEventListener(SRS_CHANGE_EVENT, load);
    };
  }, []);

  const completed = useMemo(() => new Set(profile.completedStops || []), [profile.completedStops]);
  const learnedCards = useMemo(
    () =>
      bank.filter((c) => completed.has(c.lessonSlug) && (chapter ? c.module === chapter.module : c.track === activeTrack)),
    [bank, completed, chapter, activeTrack],
  );

  // Build the sitting once everything it depends on is known.
  useEffect(() => {
    if (!ready || !trackReady || !dueTimes || queue !== null) return;
    const cards = chapter || practiceAll ? learnedCards : learnedCards.filter((c) => isDue(dueTimes, c.id, loadedAt));
    const t = setTimeout(() => setQueue(cards), 0);
    return () => clearTimeout(t);
  }, [ready, trackReady, dueTimes, loadedAt, queue, chapter, practiceAll, learnedCards]);

  // A track switch or "review everything" rebuilds the sitting.
  useEffect(() => {
    const t = setTimeout(() => {
      setQueue(null);
      setRevealed(false);
      setPicked(null);
    }, 0);
    return () => clearTimeout(t);
  }, [activeTrack, practiceAll]);

  const card = queue?.[0];
  const finished = queue !== null && queue.length === 0 && reviewed > 0;

  useEffect(() => {
    if (!finished || awarded.current) return;
    awarded.current = true;
    const result = completeActivity(`review:${localToday()}:${chapter ? catalog.lessons.find((l) => l.slug === chapter.fromLesson)?.track ?? activeTrack : activeTrack}`);
    playChime("success");
    const t = setTimeout(() => setEarned(result.xp), 0);
    return () => clearTimeout(t);
  }, [finished, chapter, catalog.lessons, activeTrack]);

  const intervals = useMemo(() => (card ? previewIntervals(card.id) : null), [card]);

  const grade = useCallback(
    (rating: Rating) => {
      if (!card || !queue) return;
      if (rating !== "again") playChime("correct");
      saveSRSState(card.id, rating);
      const rest = queue.slice(1);
      // "Again" comes back once more at the end of this sitting.
      setQueue(rating === "again" && !rest.some((c) => c.id === card.id) ? [...rest, card] : rest);
      setReviewed((n) => n + 1);
      setRevealed(false);
      setPicked(null);
      track("review_rated", { rating, card: card.id });
    },
    [card, queue],
  );

  const next = nextLessonFor(catalog, activeTrack, profile.completedStops || []);
  const nextDue = useMemo(() => {
    if (!dueTimes) return null;
    const times = learnedCards.map((c) => dueTimes[c.id]).filter((t): t is number => typeof t === "number" && t > loadedAt);
    return times.length ? Math.min(...times) : null;
  }, [dueTimes, loadedAt, learnedCards]);

  const title = chapter ? `Chapter review · ${chapter.module}` : "Night review";

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.review}>
      <FlowBar
        back={chapter ? { href: `/lesson/${chapter.fromLesson}`, label: "Lesson" } : { href: "/dashboard", label: "Dashboard" }}
        title={title}
        right={
          queue && queue.length > 0 ? (
            <span className="dc-chip dc-chip--glass">{queue.length} to go</span>
          ) : (
            <span className="dc-chip dc-chip--glass">{reviewed} reviewed</span>
          )
        }
      />

      <div className="dc-container" style={{ maxWidth: 660, paddingTop: 30, paddingBottom: 90 }}>
        {!chapter && (
          <div className="flex justify-center" style={{ marginBottom: 22 }}>
            <TrackPicker label="Review which track" />
          </div>
        )}

        {queue === null && <p className="dc-lede text-center">Gathering your cards...</p>}

        {card && (
          <>
            <p className="dc-lede text-center" style={{ marginBottom: 22 }}>
              Answer in your head first, then flip the card and be honest about how it went.
            </p>
            <article key={`${card.id}-${reviewed}`} className="dc-paper anim-pop-in" style={{ padding: "26px 28px" }}>
              <div className="flex flex-wrap items-center justify-between" style={{ gap: 8, marginBottom: 14 }}>
                <span className="dc-chip dc-chip--lavender">{card.concept.toUpperCase()}</span>
                <span className="dc-ink-muted" style={{ fontSize: 12, fontWeight: 800 }}>
                  {trackLabel(card.track)} {"·"} {card.module}
                </span>
              </div>
              <h1 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 23, lineHeight: 1.3, margin: "0 0 14px" }}>
                {card.prompt}
              </h1>
              {card.code && (
                <pre className="dc-code" style={{ padding: "14px 18px", fontSize: 13.5, lineHeight: 1.85, margin: "0 0 16px", whiteSpace: "pre-wrap", overflowX: "auto" }}>
                  {card.code}
                </pre>
              )}
              {card.options && !revealed && (
                <div className="flex flex-col" style={{ gap: 8, marginBottom: 14 }}>
                  {card.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className="dc-option"
                      data-state={picked === i ? "reveal" : undefined}
                      onClick={() => setPicked(i)}
                      aria-pressed={picked === i}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {revealed ? (
                <div className="anim-fade-up">
                  <div className="dc-callout dc-callout--success">
                    <div className="font-mono" style={{ fontSize: 14, fontWeight: 700, whiteSpace: "pre-wrap" }}>
                      {card.answer}
                    </div>
                    {card.explain && (
                      <div style={{ marginTop: 6, fontWeight: 600, fontSize: 13.5 }}>{card.explain}</div>
                    )}
                    {card.options && picked !== null && (
                      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 800 }}>
                        {card.options[picked] === card.answer ? "✓ You picked it." : "You picked a different option this time."}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setRevealed(true)} className="dc-btn dc-btn--quiet dc-btn--block" style={{ borderStyle: "dashed" }}>
                  Flip the card
                </button>
              )}
            </article>

            {revealed && intervals && (
              <div className="anim-fade-up" style={{ marginTop: 22 }}>
                <p className="text-center" style={{ color: "var(--dc-on-sky-soft)", fontWeight: 800, fontSize: 13.5, marginBottom: 12, textShadow: "var(--dc-sky-text-shadow)" }}>
                  How well did you remember it?
                </p>
                <div className="flex flex-wrap justify-center" style={{ gap: 12 }}>
                  <button type="button" onClick={() => grade("again")} className="dc-btn dc-btn--secondary dc-btn--sm">
                    Forgot {"·"} {intervals.again}
                  </button>
                  <button type="button" onClick={() => grade("good")} className="dc-btn dc-btn--primary dc-btn--sm">
                    Got it {"·"} {intervals.good}
                  </button>
                  <button type="button" onClick={() => grade("easy")} className="dc-btn dc-btn--run dc-btn--sm">
                    Easy {"·"} {intervals.easy}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {queue !== null && queue.length === 0 && (
          <div className="anim-pop-in text-center" style={{ paddingTop: "3vh" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/clouds-neon/cutout-cloud-neon-1-05.webp" alt="" className="cloud-glow" style={{ display: "block", width: 180, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }} />
            {finished ? (
              <>
                <h1 className="dc-title neon-title" style={{ marginTop: 18 }}>
                  Sky&apos;s clear
                </h1>
                <p className="dc-lede">
                  {reviewed} {reviewed === 1 ? "card" : "cards"} reviewed. Each one is now scheduled for right before you would forget it.
                </p>
                <div className="dc-chip dc-chip--butter dc-chip--lg" style={{ marginTop: 14 }}>
                  {earned === null ? "Saving..." : earned > 0 ? `+${earned} XP for today's review` : "Today's review XP is already yours"}
                </div>
              </>
            ) : learnedCards.length === 0 ? (
              <>
                <h1 className="dc-title neon-title" style={{ marginTop: 18 }}>
                  No memories yet
                </h1>
                <p className="dc-lede">
                  Every {trackLabel(activeTrack)} lesson you finish becomes a card here, timed to come back right before you would forget it.
                </p>
              </>
            ) : (
              <>
                <h1 className="dc-title neon-title" style={{ marginTop: 18 }}>
                  Nothing due right now
                </h1>
                <p className="dc-lede">
                  Your {learnedCards.length} {trackLabel(activeTrack)} {learnedCards.length === 1 ? "card is" : "cards are"} holding steady.
                  {nextDue ? ` The next one drifts back ${new Date(nextDue).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}.` : ""}
                </p>
                <div style={{ marginTop: 18 }}>
                  <button type="button" className="dc-btn dc-btn--secondary dc-btn--sm" onClick={() => setPracticeAll(true)}>
                    Review everything anyway
                  </button>
                </div>
              </>
            )}
            <div className="flex flex-wrap justify-center" style={{ gap: 14, marginTop: 26 }}>
              {next && (
                <Link href={`/lesson/${next.slug}`} className="dc-btn dc-btn--primary">
                  {chapter ? "Continue your path →" : `Keep learning: ${next.catalogTitle} →`}
                </Link>
              )}
              <Link href="/journey" className="dc-btn dc-btn--secondary">
                Open the map
              </Link>
            </div>
          </div>
        )}
      </div>
    </Scene>
  );
}
