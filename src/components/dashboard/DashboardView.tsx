"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TrackPicker from "@/components/ui/TrackPicker";
import StreakFlame from "@/components/StreakFlame";
import FlowSteps from "@/components/FlowSteps";
import BadgeMedallion from "@/components/BadgeMedallion";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { getSRSStates, isDue, SRS_CHANGE_EVENT } from "@/lib/srs";
import { badgeSnapshot, currentStreak, thisWeekActivity, todayIndex, todayXp, useUserProfile } from "@/lib/profile";
import { challengeUnlocked, getTrackModules, trackLabel, trackLessons } from "@/lib/catalog";
import { nextBadge } from "@/lib/badgeProgress";
import { RARITY } from "@/lib/badges";
import { DAILY_GOAL_XP, nextRank, rankForLevel } from "@/lib/ranks";
import { getPlacements } from "@/lib/placement";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function greeting(hour: number) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardView() {
  const catalog = useCatalog();
  const { profile, ready } = useUserProfile();
  const { track } = useActiveTrack();
  const completed = useMemo(() => profile.completedStops || [], [profile.completedStops]);
  const [hour, setHour] = useState<number | null>(null);
  const [dueTimes, setDueTimes] = useState<Record<string, number>>({});
  const [placements, setPlacements] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = () => setDueTimes(getSRSStates());
    const t = setTimeout(() => {
      setHour(new Date().getHours());
      setPlacements(getPlacements());
      load();
    }, 0);
    window.addEventListener(SRS_CHANGE_EVENT, load);
    return () => {
      clearTimeout(t);
      window.removeEventListener(SRS_CHANGE_EVENT, load);
    };
  }, []);

  const lessons = trackLessons(catalog, track);
  const done = new Set(completed);
  const doneCount = lessons.filter((l) => done.has(l.slug)).length;
  const nextLesson = lessons.find((l) => !done.has(l.slug)) ?? null;
  const allDone = lessons.length > 0 && doneCount === lessons.length;
  const modules = getTrackModules(catalog, track);
  const nextModule = nextLesson ? modules.find((m) => m.name === nextLesson.module) : null;
  const dueCount = lessons.filter((l) => done.has(l.slug) && isDue(dueTimes, `lesson:${l.slug}`)).length;
  const streak = currentStreak(profile);
  const week = thisWeekActivity(profile);
  const maxXp = Math.max(1, ...week);
  const today = todayIndex();
  const openPeak = catalog.challenges.find((c) => c.track === track && !done.has(c.slug) && challengeUnlocked(catalog, c, completed));
  const snap = badgeSnapshot(profile);
  const suggestion = nextBadge(catalog, track, snap, profile.unlockedBadges);
  const found = catalog.badges
    .filter((b) => profile.unlockedBadges.includes(b.id))
    .sort((a, b) => RARITY[b.rarity].order - RARITY[a.rarity].order)
    .slice(0, 4);
  const rank = rankForLevel(profile.level);
  const up = nextRank(profile.level);
  const earnedToday = todayXp(profile);
  const goalPercent = Math.min(100, Math.round((earnedToday / DAILY_GOAL_XP) * 100));
  // After the evening, a streak that has had no XP today is worth a nudge.
  const streakAtRisk = streak > 0 && earnedToday === 0 && hour !== null && hour >= 18;

  const placed = placements[track] ? lessons.find((l) => l.slug === placements[track]) : undefined;
  const placedAhead =
    placed && nextLesson && !done.has(placed.slug) && lessons.indexOf(placed) > lessons.indexOf(nextLesson) ? placed : undefined;

  const practiceLink = nextLesson?.practiceSlug ? `/practice/${nextLesson.practiceSlug}` : nextLesson ? `/lesson/${nextLesson.slug}` : "/lessons";
  const currentStep = allDone ? 3 : 0;

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.dashboard}>
      <div className="dc-container" style={{ maxWidth: 1080, paddingTop: 26, paddingBottom: 90 }}>
        <div className="flex flex-wrap items-end justify-between" style={{ gap: 16, marginBottom: 22 }}>
          <div>
            <h1 className="dc-title sky-text" style={{ fontSize: "clamp(30px, 4.4vw, 40px)" }}>
              {hour === null ? "Welcome back" : greeting(hour)}, {profile.name}.
            </h1>
            <p style={{ fontSize: 15, fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: "6px 0 0", textShadow: "var(--dc-sky-text-shadow)" }}>
              {!ready ? " " : completed.length === 0 ? "Welcome in. Your first lesson is one tap away." : `You are learning ${trackLabel(track)}. Here is tonight’s plan.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: 10 }}>
            <span className="dc-chip dc-chip--glass dc-chip--lg" style={{ borderColor: rank.accent, color: rank.accent }} title={`Level ${profile.level}`}>
              {rank.name} {"·"} Level {profile.level}
            </span>
            <span className="dc-chip dc-chip--solid dc-chip--lg" title={streak > 0 ? `Active ${streak} days in a row` : "Finish anything today to start a streak"}>
              <StreakFlame /> {streak}-day streak
            </span>
          </div>
        </div>

        <div className="flex justify-center" style={{ marginBottom: 22 }}>
          <TrackPicker />
        </div>

        {ready && (
          <section className="dc-glass dc-depth-card flex flex-wrap items-center justify-between" style={{ padding: "14px 22px", marginBottom: 18, gap: 14 }}>
            <div className="flex items-center" style={{ gap: 14, minWidth: 0 }}>
              <div
                role="img"
                aria-label={`Today: ${earnedToday} of ${DAILY_GOAL_XP} XP`}
                style={{
                  width: 52,
                  height: 52,
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: `conic-gradient(var(--dc-accent-solid) ${goalPercent * 3.6}deg, rgba(255,255,255,.18) 0deg)`,
                }}
              >
                <span
                  className="font-display"
                  style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--dc-glass-strong-bg)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13, color: "#ffffff" }}
                >
                  {goalPercent}%
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="dc-kicker">Today{"'"}s goal</div>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--dc-on-sky-soft)" }}>
                  {earnedToday >= DAILY_GOAL_XP
                    ? `Done: ${earnedToday} XP today. Anything else is a bonus.`
                    : `${earnedToday} of ${DAILY_GOAL_XP} XP. One lesson and its practice does it.`}
                </div>
              </div>
            </div>
            {streakAtRisk && (
              <span className="dc-chip dc-chip--butter dc-chip--lg" title="Finish anything today to keep the streak alive">
                <StreakFlame /> {streak}-day streak at risk
              </span>
            )}
          </section>
        )}

        <section className="dc-glass dc-depth-card" style={{ padding: "20px 22px 18px", marginBottom: 22 }}>
          <div className="flex flex-wrap items-center justify-between" style={{ marginBottom: 14, gap: 10 }}>
            <h2 className="font-display" style={{ fontWeight: 800, fontSize: 18, margin: 0 }}>
              Your path
            </h2>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--dc-on-sky-muted)" }}>
              {allDone ? "Every lesson cleared. Time to build." : "Learn, practice, challenge, build. Same four moves every time."}
            </span>
          </div>
          <FlowSteps
            current={currentStep}
            compact
            links={[nextLesson ? `/lesson/${nextLesson.slug}` : "/lessons", practiceLink, openPeak ? `/challenge/${openPeak.slug}` : "/peaks", "/projects"]}
          />
        </section>

        {placedAhead && (
          <Link href={`/lesson/${placedAhead.slug}`} className="dc-glass dc-depth-card dc-depth-card--interactive block" style={{ padding: "14px 22px", marginBottom: 18 }}>
            <span className="dc-kicker">Placement suggestion</span>{" "}
            <span style={{ fontWeight: 800, fontSize: 14.5 }}>Your placement check says you can jump ahead to {placedAhead.catalogTitle} →</span>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 18 }}>
          <Link href={allDone ? "/projects" : nextLesson ? `/lesson/${nextLesson.slug}` : "/lessons"} className="dc-glass dc-depth-card dc-depth-card--interactive block" style={{ padding: "24px 26px" }}>
            <div className="dc-kicker">{completed.length === 0 ? "Start here" : "Continue where you left off"}</div>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 26, margin: "8px 0 4px", textShadow: "var(--dc-sky-text-shadow)" }}>
              {allDone ? "Track complete!" : nextLesson?.catalogTitle ?? "Pick a lesson"}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--dc-on-sky-soft)" }}>
              {allDone
                ? "Every lesson cleared. Build a project of your own."
                : nextModule
                  ? `Chapter ${nextModule.chapter} · ${nextModule.name} · ${doneCount} of ${lessons.length} lessons done`
                  : ""}
            </div>
            <div className="dc-progress" style={{ marginTop: 16 }} aria-label={`${doneCount} of ${lessons.length} lessons complete`} role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={lessons.length}>
              <div className="dc-progress__fill" style={{ width: `${lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0}%` }} />
            </div>
            <div className="font-display" style={{ marginTop: 14, fontWeight: 800, fontSize: 15, color: "var(--dc-link)" }}>
              {completed.length === 0 ? "Start lesson 1" : "Resume"} {"→"}
            </div>
          </Link>

          <Link href="/review" className="dc-glass dc-depth-card dc-depth-card--interactive block" style={{ padding: "24px 26px" }}>
            <div className="dc-kicker">Night review {"·"} spaced recall</div>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 26, margin: "8px 0 4px", textShadow: "var(--dc-sky-text-shadow)" }}>
              {dueCount} {dueCount === 1 ? "card" : "cards"} due
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--dc-on-sky-soft)", lineHeight: 1.6 }}>
              {doneCount === 0
                ? "Every lesson you finish comes back here right before you would forget it."
                : dueCount === 0
                  ? "Nothing is due right now. Your memories are holding steady."
                  : "Two minutes now keeps these yours for weeks."}
            </div>
            <div className="font-display" style={{ marginTop: 16, fontWeight: 800, fontSize: 15, color: "var(--dc-link)" }}>
              {dueCount > 0 ? "Clear the sky" : "Open review"} {"→"}
            </div>
          </Link>

          <section className="dc-glass dc-depth-card" style={{ padding: "24px 26px" }}>
            <div className="dc-kicker" style={{ color: rank.accent }}>
              {rank.name} {"·"} Level {profile.level}
              {up ? ` · ${rank.name === up.name ? "" : `${up.name} at level ${up.from}`}` : " · top rank"}
            </div>
            <div className="flex flex-wrap items-end justify-between" style={{ margin: "8px 0 10px", gap: 8 }}>
              <div className="font-display" style={{ fontWeight: 800, fontSize: 26, textShadow: "var(--dc-sky-text-shadow)" }}>
                {profile.xp} / {profile.xpNext} XP
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--dc-on-sky-muted)" }}>
                {profile.xpNext - profile.xp} to level {profile.level + 1}
              </div>
            </div>
            <div className="dc-progress" style={{ height: 12, marginBottom: 20 }}>
              <div className="dc-progress__fill" style={{ width: `${Math.round((profile.xp / profile.xpNext) * 100)}%` }} />
            </div>
            <div className="dc-kicker" style={{ color: "var(--dc-on-sky-muted)", marginBottom: 10 }}>
              This week
            </div>
            <div className="flex items-end justify-between" style={{ gap: 8, height: 70 }} role="img" aria-label={`XP this week: ${week.map((xp, i) => `${DAYS[i]} ${xp}`).join(", ")}`}>
              {week.map((xp, i) => (
                <div key={i} className="flex flex-1 flex-col items-center" style={{ gap: 5 }} title={`${xp} XP`}>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max(6, (xp / maxXp) * 52)}px`,
                      background: i === today ? "var(--dc-accent)" : xp > 0 ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.2)",
                      borderRadius: 6,
                      boxShadow: i === today ? "0 0 12px var(--dc-accent-glow)" : undefined,
                    }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 900, color: i === today ? "#ffffff" : "var(--dc-on-sky-muted)" }}>{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </section>

          <Link href="/badges" className="dc-glass dc-depth-card dc-depth-card--interactive block" style={{ padding: "24px 26px" }}>
            <div className="flex items-center justify-between">
              <div className="dc-kicker">
                Your sky {"·"} {profile.unlockedBadges.length} of {catalog.badges.length} badges
              </div>
              <span className="font-display" style={{ fontWeight: 800, fontSize: 13, color: "var(--dc-link)" }}>
                See all {"→"}
              </span>
            </div>
            <div className="flex" style={{ marginTop: 14, gap: 12, minHeight: 64 }}>
              {found.length === 0 && (
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--dc-on-sky-muted)", alignSelf: "center" }}>No badges yet. The first one is close.</div>
              )}
              {found.map((b, i) => (
                <div key={b.id} style={{ width: 64, animation: `floatySm ${6 + i}s ease-in-out ${i * 0.4}s infinite` }} title={`${b.name} · ${RARITY[b.rarity].label}`}>
                  <BadgeMedallion icon={b.icon} accent={b.accent} found ring={RARITY[b.rarity].ring} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 13.5, fontWeight: 700, color: "var(--dc-on-sky-soft)", lineHeight: 1.55 }}>
              {suggestion ? (
                <>
                  Next up: <strong style={{ color: "#ffffff" }}>{suggestion.badge.name}</strong>{" "}
                  <span style={{ color: RARITY[suggestion.badge.rarity].ring }}>({RARITY[suggestion.badge.rarity].label})</span>. {suggestion.action}.
                  {suggestion.progressLabel ? ` ${suggestion.progressLabel}.` : ""}
                </>
              ) : (
                "Every badge earned. The sky is full."
              )}
            </div>
          </Link>
        </div>

        {openPeak && (
          <Link href={`/challenge/${openPeak.slug}`} className="dc-glass dc-depth-card dc-depth-card--interactive flex flex-wrap items-center justify-between" style={{ padding: "18px 24px", marginTop: 18, gap: 12 }}>
            <div>
              <div className="dc-kicker">Problem Peak ready {"·"} {openPeak.level}</div>
              <div className="font-display" style={{ fontWeight: 800, fontSize: 20, marginTop: 4 }}>
                {openPeak.name}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--dc-on-sky-soft)" }}>{openPeak.blurb}</div>
            </div>
            <span className="dc-chip dc-chip--butter dc-chip--lg">+{openPeak.xp} XP {"→"}</span>
          </Link>
        )}

        <nav aria-label="More places" className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 30 }}>
          <Link href="/journey" className="dc-pill">Journey map</Link>
          <Link href="/peaks" className="dc-pill">Problem Peaks</Link>
          <Link href="/projects" className="dc-pill">Projects</Link>
          <Link href="/lessons" className="dc-pill">All lessons</Link>
          <Link href="/leaderboard" className="dc-pill">Leaderboard</Link>
          <Link href="/placement" className="dc-pill">Placement check</Link>
        </nav>
      </div>
    </Scene>
  );
}
