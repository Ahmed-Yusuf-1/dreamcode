"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import StreakFlame from "@/components/StreakFlame";
import FlowSteps from "@/components/FlowSteps";
import { badges, reviewCards } from "@/lib/data";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { getSRSStates } from "@/lib/srs";
import { useUserProfile } from "@/lib/profile";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const cs = cloudOpacity.dashboard;

const PYTHON_STOPS = [
  { slug: "variables", title: "Variables", type: "lesson", href: "/lesson/variables", chapter: "Python Basics - Chapter 1" },
  { slug: "strings", title: "Strings", type: "lesson", href: "/lesson/strings", chapter: "Python Basics - Chapter 1" },
  { slug: "loops", title: "Loops", type: "lesson", href: "/lesson/loops", chapter: "Python Basics - Chapter 1" },
  { slug: "functions", title: "Functions", type: "lesson", href: "/lesson/functions", chapter: "Python Basics - Chapter 1" },
];

const JS_STOPS = [
  { slug: "js-variables", title: "Let and Const", type: "lesson", href: "/lesson/js-variables", chapter: "JavaScript Climbs - Chapter 1" },
  { slug: "js-functions", title: "Arrow Functions", type: "lesson", href: "/lesson/js-functions", chapter: "JavaScript Climbs - Chapter 1" },
  { slug: "cloud-hopper", title: "Cloud Hopper", type: "challenge", href: "/challenge/cloud-hopper", chapter: "JavaScript Climbs - Chapter 1" },
  { slug: "fog-filter", title: "Fog Filter", type: "challenge", href: "/peaks", chapter: "JavaScript Climbs - Chapter 1" },
];

export default function DashboardPage() {
  const { profile } = useUserProfile();
  const found = badges.filter((b) => profile.unlockedBadges.includes(b.id)).slice(0, 4);
  // Guard against a zero-activity week (new learner): avoid dividing by 0 -> NaN.
  const maxXp = Math.max(1, ...profile.weekActivity);
  const { track } = useActiveTrack();

  const stops = track === "javascript" ? JS_STOPS : PYTHON_STOPS;
  const completed = profile.completedStops || [];
  const continueStop = stops.find((s) => !completed.includes(s.slug)) || stops[stops.length - 1];
  const trackStopSlugs = stops.map(s => s.slug);
  const completedCountInTrack = trackStopSlugs.filter(slug => completed.includes(slug)).length;

  let continueHref = continueStop.href;
  let continueTitle = `${continueStop.title} \u00b7 Lesson`;
  let continueDesc = `${continueStop.chapter} \u00b7 Stop ${stops.indexOf(continueStop) + 1} of ${stops.length}`;
  let continueProgress = Math.round((completedCountInTrack / stops.length) * 100);
  let currentStepIndex = 0; // Learn

  if (continueStop.type === "lesson") {
    if (completed.includes(continueStop.slug)) {
      const hasPractice = ["variables", "strings", "loops"].includes(continueStop.slug);
      const practiceCompleted = completed.includes(`practice:${continueStop.slug}`);
      if (hasPractice && !practiceCompleted) {
        continueHref = `/practice/${continueStop.slug}`;
        continueTitle = `${continueStop.title} \u00b7 Practice`;
        continueProgress = Math.max(10, Math.round(((completedCountInTrack - 0.5) / stops.length) * 100));
        currentStepIndex = 1; // Practice
      } else {
        currentStepIndex = 2; // Challenge
      }
    } else {
      currentStepIndex = 0; // Learn
    }
  } else if (continueStop.type === "challenge") {
    currentStepIndex = 2; // Challenge
  }

  if (completedCountInTrack === stops.length) {
    continueHref = "/projects";
    continueTitle = "Chapter 1 Completed!";
    continueDesc = "Ready for Guided & Independent Projects?";
    continueProgress = 100;
    currentStepIndex = 3; // Build
  }

  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    const updateDueCount = () => {
      const states = getSRSStates();
      const now = Date.now();
      const count = reviewCards.filter((c) => (states[c.id] ?? 0) <= now).length;
      setDueCount(count);
    };
    updateDueCount();
    window.addEventListener("dc_srs_change", updateDueCount);
    return () => window.removeEventListener("dc_srs_change", updateDueCount);
  }, []);

  useEffect(() => {
    document.title = "Dashboard - dreamcode";
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #2b2c63 0%, #4c4096 38%, #8E95CE 72%, #d9b9d6 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-11.webp" speed={0.05} pos={{ left: "-7%", top: "8%" }} width="min(460px, 36vw)" opacity={0.8} duration={15} scale={cs} neon="magenta" />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.1} pos={{ right: "-4%", top: "34%" }} width="min(340px, 27vw)" opacity={0.8} duration={12} delay={1.3} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.08} pos={{ right: "2%", top: "4%" }} width="min(260px, 22vw)" opacity={0.62} duration={13} delay={0.5} scale={cs} neon="cyan" />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.14} pos={{ left: "4%", bottom: "6%" }} width="min(280px, 22vw)" opacity={0.75} anim="floatySm" duration={10} delay={0.6} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp" speed={0.1} pos={{ right: "-3%", bottom: "4%" }} width="min(300px, 24vw)" opacity={0.68} anim="floatySm" duration={12} delay={1.1} scale={cs} />

      {/* top bar - streak + avatar (brand lives in the global nav) */}
      <div className="relative z-6 flex items-center justify-end" style={{ padding: "16px clamp(16px, 4vw, 44px) 0", gap: 12 }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <div
            className="flex items-center backdrop-blur-md"
            style={{
              gap: 8,
              background: "rgba(255,255,255,.92)",
              padding: "7px 14px",
              borderRadius: 999,
            }}
          >
            <StreakFlame />
            <span style={{ fontWeight: 900, fontSize: 13, color: "#9c4a14" }}>{profile.streak}-day streak</span>
          </div>
          <Link
            href="/profile"
            className="font-display flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ffb6d9, #cdb9f7)",
              border: "2px solid #ffffff",
              fontWeight: 800,
              color: "#ffffff",
              fontSize: 15,
            }}
          >
            {profile.initial}
          </Link>
        </div>
      </div>

      <div className="relative z-5 mx-auto" style={{ maxWidth: 1060, padding: "10px 32px 90px" }}>
        <h1
          className="font-display sky-text"
          style={{ fontWeight: 800, fontSize: 38, color: "#ffffff", margin: "0 0 4px" }}
        >
          Good evening, {profile.name}.
        </h1>
        <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,.85)", margin: "0 0 24px" }}>
          {completed.length === 0
            ? "Welcome in. Your first lesson is one tap away below."
            : "The sky kept your place. Here is tonight’s plan."}
        </p>

        {/* the path - always visible so the next move is obvious */}
        <div
          className="glass"
          style={{ borderRadius: 22, padding: "22px 24px 20px", marginBottom: 24, boxShadow: "0 16px 40px rgba(15,12,50,.3)" }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 18, color: "#ffffff" }}>
              Your path
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.75)" }}>
              Same four steps every time. Right now you are on a lesson.
            </div>
          </div>
          <FlowSteps current={currentStepIndex} compact />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 18 }}>
          {/* continue */}
          <Link
            href={continueHref}
            className="glass glow-hover block transition-transform hover:-translate-y-1"
            style={{ borderRadius: 24, padding: "26px 28px", boxShadow: "0 18px 44px rgba(20,16,60,.3)" }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: "#ffd9ef", textShadow: "0 0 10px rgba(255,138,222,.7)" }}>
              CONTINUE WHERE YOU LEFT OFF
            </div>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 26, color: "#ffffff", margin: "8px 0 4px", textShadow: "0 2px 12px rgba(20,16,50,.6)" }}>
              {continueTitle}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.88)" }}>
              {continueDesc}
            </div>
            <div style={{ marginTop: 16, width: "100%", height: 10, background: "rgba(255,255,255,.25)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${continueProgress}%`, height: "100%", background: "linear-gradient(90deg, #a9ecc9, #ffe49a)", borderRadius: 99 }} />
            </div>
            <div className="font-display" style={{ marginTop: 14, fontWeight: 800, fontSize: 15, color: "#ffe7f4" }}>
              Resume the night drive {"\u2192"}
            </div>
          </Link>

          {/* reviews due */}
          <Link
            href="/review"
            className="glass glow-hover block transition-transform hover:-translate-y-1"
            style={{ borderRadius: 24, padding: "26px 28px", boxShadow: "0 18px 44px rgba(20,16,60,.3)" }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: "#cdeaff", textShadow: "0 0 10px rgba(110,230,255,.7)" }}>
              NIGHT REVIEW · SPACED RECALL
            </div>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 26, color: "#ffffff", margin: "8px 0 4px", textShadow: "0 2px 12px rgba(20,16,50,.6)" }}>
              {dueCount} {dueCount === 1 ? "memory" : "memories"} due
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.88)", lineHeight: 1.6 }}>
              Variables, strings and two loops drifted back. Two minutes keeps them yours for a
              week.
            </div>
            <div className="font-display" style={{ marginTop: 18, fontWeight: 800, fontSize: 15, color: "#d9f2ff" }}>
              Clear the sky {"\u2192"}
            </div>
          </Link>

          {/* level / XP */}
          <div className="glass" style={{ borderRadius: 24, padding: "26px 28px", boxShadow: "0 18px 44px rgba(20,16,60,.3)" }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: "rgba(255,255,255,.8)" }}>
              LEVEL {profile.level}
            </div>
            <div className="flex items-end justify-between" style={{ margin: "8px 0 10px" }}>
              <div className="font-display" style={{ fontWeight: 800, fontSize: 26, color: "#ffffff", textShadow: "0 2px 12px rgba(20,16,50,.6)" }}>
                {profile.xp} / {profile.xpNext} XP
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,.8)" }}>
                {profile.xpNext - profile.xp} to level {profile.level + 1}
              </div>
            </div>
            <div style={{ width: "100%", height: 12, background: "rgba(255,255,255,.25)", borderRadius: 99, overflow: "hidden", marginBottom: 20 }}>
              <div
                style={{
                  width: `${Math.round((profile.xp / profile.xpNext) * 100)}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #a9ecc9, #ffe49a)",
                  borderRadius: 99,
                }}
              />
            </div>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: "rgba(255,255,255,.8)", marginBottom: 10 }}>
              THIS WEEK
            </div>
            <div className="flex items-end justify-between" style={{ gap: 8, height: 64 }}>
              {profile.weekActivity.map((xp, i) => (
                <div key={i} className="flex flex-1 flex-col items-center" style={{ gap: 5 }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max(8, (xp / maxXp) * 52)}px`,
                      background: i === profile.weekActivity.length - 1
                        ? "linear-gradient(180deg, #ff9ede, #ff4fb0)"
                        : "rgba(255,255,255,.55)",
                      borderRadius: 6,
                      boxShadow: i === profile.weekActivity.length - 1 ? "0 0 12px rgba(255,100,200,.6)" : undefined,
                    }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,.75)" }}>{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* badges */}
          <Link
            href="/badges"
            className="glass glow-hover block transition-transform hover:-translate-y-1"
            style={{ borderRadius: 24, padding: "26px 28px", boxShadow: "0 18px 44px rgba(20,16,60,.3)" }}
          >
            <div className="flex items-center justify-between">
              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.2, color: "rgba(255,255,255,.8)" }}>
                YOUR SKY {"\u00b7"} {profile.unlockedBadges.length} OF {badges.length}
              </div>
              <span className="font-display" style={{ fontWeight: 800, fontSize: 13, color: "#ffe7f4" }}>
                See all {"\u2192"}
              </span>
            </div>
            <div className="flex justify-between" style={{ marginTop: 16, gap: 8 }}>
              {found.map((b, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={b.id}
                  src={b.img}
                  alt={b.name}
                  className="cloud-glow"
                  style={{ width: "22%", height: "auto", animation: `floatySm ${6 + i}s ease-in-out ${i * 0.4}s infinite` }}
                />
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,.88)" }}>
              Next up: <strong style={{ color: "#ffffff" }}>Function Forger</strong> - write 10
              functions. You&apos;re at 6.
            </div>
          </Link>
        </div>

        {/* quick links */}
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 30 }}>
          {[
            ["Journey map", "/journey"],
            ["Problem peaks", "/peaks"],
            ["Projects", "/projects"],
            ["Lessons", "/lessons"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="cursor-pointer backdrop-blur-md transition-colors hover:bg-white/30"
              style={{
                background: "rgba(255,255,255,.16)",
                border: "2px solid rgba(255,255,255,.55)",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: 13,
                padding: "10px 20px",
                borderRadius: 999,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
