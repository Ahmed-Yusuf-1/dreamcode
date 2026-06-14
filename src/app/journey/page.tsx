"use client";

import { useEffect } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import StreakFlame from "@/components/StreakFlame";
import { useUserProfile } from "@/lib/profile";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";

const cs = cloudOpacity.journey;

const PYTHON_STOPS = ["variables", "strings", "loops", "functions"];
const JS_STOPS = ["js-variables", "js-functions", "cloud-hopper", "fog-filter"];

function getStopState(slug: string, orderedSlugs: string[], completedStops: string[]): "done" | "current" | "locked" {
  if (completedStops.includes(slug)) return "done";
  const idx = orderedSlugs.indexOf(slug);
  if (idx === 0) return "current";
  const prevSlug = orderedSlugs[idx - 1];
  if (completedStops.includes(prevSlug)) return "current";
  return "locked";
}

export default function JourneyPage() {
  const { profile } = useUserProfile();
  const { track } = useActiveTrack();
  const completed = profile.completedStops || [];

  useEffect(() => {
    document.title = "Journey Map - dreamcode";
  }, []);

  return (
    <div
      className="relative"
      style={{
        minHeight: "100vh",
        overflowX: "clip",
        background:
          "linear-gradient(180deg, #1a1c52 0%, #2b2c63 20%, #4c4096 44%, #8E95CE 68%, #d9a9c7 86%, #F0AABE 100%)",
      }}
    >
      {/* sunset cutouts scattered down the whole road */}
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-11.webp" speed={0.05} pos={{ left: "-6%", top: "3%" }} width="min(480px, 38vw)" opacity={0.75} duration={15} scale={cs} neon="cyan" />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp" speed={0.09} pos={{ right: "-5%", top: "8%" }} width="min(400px, 32vw)" opacity={0.7} duration={12} delay={1.4} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.13} pos={{ left: "1%", top: "30%" }} width="min(360px, 29vw)" opacity={0.75} duration={13} delay={0.7} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.11} pos={{ right: "-4%", top: "40%" }} width="min(300px, 24vw)" opacity={0.6} duration={14} delay={0.3} scale={cs} neon="magenta" />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.08} pos={{ right: "1%", top: "56%" }} width="min(330px, 26vw)" opacity={0.7} duration={11} delay={2} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.12} pos={{ left: "-4%", top: "62%" }} width="min(280px, 22vw)" opacity={0.6} anim="floatySm" duration={12} delay={0.8} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-14.webp" speed={0.16} pos={{ left: "3%", top: "78%" }} width="min(300px, 24vw)" opacity={0.65} anim="floatySm" duration={10} delay={1} scale={cs} />

      {/* spacer to clear the fixed global nav */}
      <div style={{ height: "var(--nav-h)" }} />

      {/* HUD - sits just under the global nav */}
      <div
        className="sticky z-20 flex flex-wrap items-center justify-between backdrop-blur-lg"
        style={{
          top: "var(--nav-h)",
          gap: 14,
          padding: "12px clamp(16px, 4vw, 32px)",
          background: "rgba(24,20,70,.5)",
          borderBottom: "1px solid rgba(255,255,255,.18)",
        }}
      >
        <div
          className="flex"
          style={{
            gap: 6,
            background: "rgba(255,255,255,.14)",
            padding: 5,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.25)",
          }}
        >
          <span
            style={{
              background: "#ffffff",
              color: "#13335f",
              fontWeight: 900,
              fontSize: 13,
              padding: "8px 18px",
              borderRadius: 999,
            }}
          >
            Basics Path
          </span>
          <Link
            href="/peaks"
            className="cursor-pointer transition-colors hover:bg-white/18"
            style={{
              background: "transparent",
              color: "rgba(255,255,255,.9)",
              fontWeight: 900,
              fontSize: 13,
              padding: "8px 18px",
              borderRadius: 999,
            }}
          >
            Problem Peaks
          </Link>
        </div>

        <div className="flex items-center" style={{ gap: 14 }}>
          <div
            className="flex items-center"
            style={{ gap: 8, background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999 }}
          >
            <StreakFlame />
            <span style={{ fontWeight: 900, fontSize: 13, color: "#9c4a14" }}>{profile.streak}</span>
          </div>
          <div className="flex flex-col" style={{ gap: 4 }}>
            <div
              className="flex justify-between"
              style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,.95)" }}
            >
              <span>Level {profile.level}</span>
              <span>
                {profile.xp} / {profile.xpNext} XP
              </span>
            </div>
            <div
              style={{
                width: 170,
                height: 10,
                background: "rgba(255,255,255,.28)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round((profile.xp / profile.xpNext) * 100)}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #a9ecc9, #ffe49a)",
                  borderRadius: 99,
                }}
              />
            </div>
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

      <div className="relative z-5 text-center" style={{ padding: "44px 20px 6px" }}>
        <h2
          className="font-display glow-heading"
          style={{ fontWeight: 800, fontSize: 42, color: "#ffffff", margin: 0 }}
        >
          {track === "javascript" ? "JavaScript Climbs - Chapter 1" : "Python Basics - Chapter 1"}
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,.9)",
            fontWeight: 700,
            fontSize: 16,
            margin: "10px 0 0",
            textShadow: "0 2px 14px rgba(20,16,50,.6)",
          }}
        >
          The road starts in the warm light and climbs into the neon night.
        </p>
      </div>

      {/* the map - start at the bottom, boss at the top */}
      <div className="relative z-5" style={{ width: 720, maxWidth: "94vw", height: 1480, margin: "10px auto 0" }}>
        <svg
          viewBox="0 0 720 1480"
          className="absolute inset-0 h-full w-full"
          style={{ overflow: "visible", filter: "drop-shadow(0 0 10px rgba(255,190,240,.45))" }}
        >
          <path
            d="M 360 1390 C 240 1350, 190 1270, 190 1160 C 190 1050, 530 1020, 530 910 C 530 800, 190 780, 190 670 C 190 560, 530 540, 530 430 C 530 320, 360 280, 360 170"
            fill="none"
            stroke="rgba(255,255,255,.85)"
            strokeWidth={7}
            strokeDasharray="2 20"
            strokeLinecap="round"
          />
        </svg>

        {/* start: a small cloud landing */}
        <div
          className="absolute flex flex-col items-center"
          style={{ left: 360, top: 1390, transform: "translate(-50%,-50%)", gap: 2 }}
        >
          <div
            className="backdrop-blur-md"
            style={{
              background: "rgba(255,255,255,.92)",
              padding: "8px 18px",
              borderRadius: 999,
              fontWeight: 900,
              fontSize: 13,
              color: "#13335f",
              boxShadow: "0 0 22px rgba(255,255,255,.45), 0 10px 24px rgba(40,20,70,.35)",
            }}
          >
            START HERE
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp"
            alt=""
            className="cloud-glow"
            style={{ display: "block", width: 200, height: "auto", animation: "floatySm 9s ease-in-out infinite" }}
          />
        </div>

        {/* nodes */}
        {track === "javascript" ? (
          <>
            <MapNode
              left={190}
              top={1160}
              state={getStopState("js-variables", JS_STOPS, completed)}
              title="1 · Let and Const"
              sub={completed.includes("js-variables") ? "Complete · +60 XP" : "Lesson 1 of 2 · Start \u2192"}
              href="/lesson/js-variables"
              cloud="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp"
            />
            <MapNode
              left={530}
              top={910}
              state={getStopState("js-functions", JS_STOPS, completed)}
              title="2 \u00b7 Arrow Functions"
              sub={completed.includes("js-functions") ? "Complete · +60 XP" : getStopState("js-functions", JS_STOPS, completed) === "current" ? "Lesson 2 of 2 \u00b7 Continue \u2192" : "Locked"}
              href="/lesson/js-functions"
              cloud="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp"
            />
            <MapNode
              left={190}
              top={670}
              state={getStopState("cloud-hopper", JS_STOPS, completed)}
              title="3 · Cloud Hopper"
              sub={completed.includes("cloud-hopper") ? "Complete · +40 XP" : getStopState("cloud-hopper", JS_STOPS, completed) === "current" ? "Challenge \u00b7 Continue \u2192" : "Finish Functions to unlock"}
              href="/challenge/cloud-hopper"
              cloud="/assets/clouds-neon/cutout-cloud-neon-1-01.webp"
            />
            <MapNode
              left={530}
              top={430}
              state={getStopState("fog-filter", JS_STOPS, completed)}
              title="4 · Fog Filter"
              sub={completed.includes("fog-filter") ? "Complete · +60 XP" : "Finish Cloud Hopper to unlock"}
              href="/peaks"
              cloud="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp"
            />
          </>
        ) : (
          <>
            <MapNode
              left={190}
              top={1160}
              state={getStopState("variables", PYTHON_STOPS, completed)}
              title="1 · Variables"
              sub={completed.includes("variables") ? "Complete · +60 XP" : "Lesson 1 of 4 · Start \u2192"}
              href="/lesson/variables"
              cloud="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp"
            />
            <MapNode
              left={530}
              top={910}
              state={getStopState("strings", PYTHON_STOPS, completed)}
              title="2 · Strings"
              sub={completed.includes("strings") ? "Complete · +60 XP" : getStopState("strings", PYTHON_STOPS, completed) === "current" ? "Lesson 2 of 4 \u00b7 Continue \u2192" : "Locked"}
              href="/lesson/strings"
              cloud="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp"
            />
            <MapNode
              left={190}
              top={670}
              state={getStopState("loops", PYTHON_STOPS, completed)}
              title="3 \u00b7 Loops"
              sub={completed.includes("loops") ? "Complete · +60 XP" : getStopState("loops", PYTHON_STOPS, completed) === "current" ? "Lesson 3 of 4 \u00b7 Continue \u2192" : "Locked"}
              href="/lesson/loops"
              cloud="/assets/clouds-neon/cutout-cloud-neon-1-01.webp"
            />
            <MapNode
              left={530}
              top={430}
              state={getStopState("functions", PYTHON_STOPS, completed)}
              title="4 · Functions"
              sub={completed.includes("functions") ? "Complete · +60 XP" : getStopState("functions", PYTHON_STOPS, completed) === "current" ? "Lesson 4 of 4 \u00b7 Continue \u2192" : "Finish Loops to unlock"}
              href="/lesson/functions"
              cloud="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp"
            />
          </>
        )}

        {/* boss: the Sky House on a big neon cloud */}
        <div
          className="absolute z-4"
          style={{ left: 360, top: 150, transform: "translate(-50%,-50%)" }}
        >
        <div
          className="flex flex-col items-center"
          style={{ animation: "floatySm 8s ease-in-out infinite" }}
        >
          <div className="relative z-2 flex flex-col items-center" style={{ marginBottom: -26 }}>
            {/* tiny house: roof + body + door */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "33px solid transparent",
                borderRight: "33px solid transparent",
                borderBottom: "24px solid #f78fb8",
                filter: "drop-shadow(0 0 12px rgba(255,150,210,.7))",
              }}
            />
            <div
              className="relative"
              style={{
                width: 52,
                height: 42,
                background: "#ffc9dd",
                borderRadius: 6,
                boxShadow: "inset -10px 0 0 rgba(180,90,130,.22), 0 0 18px rgba(255,170,220,.5)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 12,
                  height: 16,
                  background: "#8a4a64",
                  borderRadius: 3,
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/clouds-neon/cutout-cloud-neon-1-04.webp"
            alt=""
            className="cloud-glow"
            style={{ display: "block", width: 250, height: "auto" }}
          />
          <Link
            href="/projects"
            className="glass block text-center transition-transform hover:-translate-y-0.5"
            style={{
              marginTop: 2,
              padding: "10px 20px",
              borderRadius: 16,
              boxShadow: "0 0 24px rgba(255,150,220,.25), 0 14px 30px rgba(20,12,50,.35)",
            }}
          >
            <div
              className="font-display"
              style={{ fontWeight: 800, fontSize: 16, color: "#ffffff", textShadow: "0 2px 10px rgba(20,12,50,.6)" }}
            >
              {track === "javascript" ? "Chapter Project · Star Map" : "Chapter Project · Sky House"}
            </div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#ffd9ef", textShadow: "0 0 10px rgba(255,138,222,.6)" }}>
              Build a tiny program of your own · +200 XP
            </div>
          </Link>
        </div>
        </div>
      </div>
      <div style={{ height: 70 }} />
    </div>
  );
}

function MapNode({
  left,
  top,
  state,
  title,
  sub,
  href,
  cloud,
}: {
  left: number;
  top: number;
  state: "done" | "current" | "locked";
  title: string;
  sub: string;
  href?: string;
  cloud: string;
}) {
  const inner = (
    <>
      {/* marker */}
      {state === "done" && (
        <div
          className="relative z-2 flex items-center justify-center"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "#a9ecc9",
            border: "4px solid #ffffff",
            boxShadow: "0 0 20px rgba(169,236,201,.55), 0 10px 26px rgba(20,12,50,.4)",
            fontWeight: 900,
            fontSize: 20,
            color: "#0f5c38",
            marginBottom: -22,
          }}
        >
          ✓
        </div>
      )}
      {state === "current" && (
        <div
          className="font-display anim-pulse-ring relative z-2 flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
            border: "4px solid #ffffff",
            boxShadow: "0 0 28px rgba(255,100,200,.75), 0 12px 30px rgba(20,12,50,.45)",
            fontWeight: 800,
            fontSize: 15,
            color: "#ffffff",
            marginBottom: -26,
          }}
        >
          GO
        </div>
      )}
      {state === "locked" && (
        <div
          className="relative z-2 flex items-center justify-center backdrop-blur-xs"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "rgba(255,255,255,.5)",
            border: "4px solid rgba(255,255,255,.8)",
            marginBottom: -22,
          }}
        >
          {/* padlock */}
          <div
            className="relative"
            style={{ width: 18, height: 14, background: "rgba(255,255,255,.85)", borderRadius: 4, marginTop: 8 }}
          >
            <div
              style={{
                position: "absolute",
                width: 12,
                height: 11,
                border: "3px solid rgba(255,255,255,.85)",
                borderBottom: "none",
                borderRadius: "9px 9px 0 0",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>
      )}

      {/* cloud platform */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cloud}
        alt=""
        className={state === "locked" ? undefined : "cloud-glow"}
        style={{
          display: "block",
          width: state === "current" ? 230 : 190,
          height: "auto",
          filter: state === "locked" ? "grayscale(1) brightness(1.3) opacity(.7)" : undefined,
          animation: state === "current" ? "floatySm 6s ease-in-out infinite" : undefined,
        }}
      />

      {/* label */}
      <div
        className="glass text-center"
        style={{
          marginTop: 0,
          padding: state === "current" ? "10px 20px" : "8px 16px",
          borderRadius: 16,
          background: state === "current" ? "rgba(255,255,255,.28)" : undefined,
          boxShadow:
            state === "current"
              ? "0 0 26px rgba(255,150,220,.3), 0 14px 30px rgba(20,12,50,.4)"
              : "0 12px 28px rgba(20,12,50,.35)",
          opacity: state === "locked" ? 0.7 : 1,
        }}
      >
        <div
          className="font-display"
          style={{
            fontWeight: state === "current" ? 800 : 700,
            fontSize: state === "current" ? 16 : 15,
            color: state === "locked" ? "rgba(255,255,255,.75)" : "#ffffff",
            textShadow: "0 2px 10px rgba(20,12,50,.6)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 900,
            color:
              state === "locked"
                ? "rgba(255,255,255,.55)"
                : state === "current"
                  ? "#ffd9ef"
                  : "#b9f5d2",
            textShadow: state === "current" ? "0 0 10px rgba(255,138,222,.6)" : undefined,
          }}
        >
          {sub}
        </div>
      </div>
    </>
  );

  const baseStyle: React.CSSProperties = {
    left,
    top,
    transform: "translate(-50%,-50%)",
    zIndex: 6,
  };

  if (href && state !== "locked") {
    return (
      <Link
        href={href}
        className="absolute flex cursor-pointer flex-col items-center transition-transform duration-200 hover:scale-105"
        style={baseStyle}
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="absolute flex flex-col items-center" style={baseStyle}>
      {inner}
    </div>
  );
}
