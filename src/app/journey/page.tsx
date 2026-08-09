"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import StreakFlame from "@/components/StreakFlame";
import { useUserProfile } from "@/lib/profile";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { lessons, type Lesson } from "@/lib/curriculum";
import { getModuleChallenge, type Challenge } from "@/lib/data";

const cs = cloudOpacity.journey;

// Cloud platforms are cycled across the nodes so the road stays varied at any length.
const NODE_CLOUDS = [
  "/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp",
  "/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp",
  "/assets/clouds-neon/cutout-cloud-neon-1-01.webp",
  "/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp",
  "/assets/clouds-neon/cutout-cloud-neon-1-02.webp",
];

// Map layout constants (SVG units; the container is 720 wide).
const GAP = 175;
const BOSS_Y = 150;
const X_LEFT = 190;
const X_RIGHT = 530;
const X_CENTER = 360;

const TIER_COLORS = {
  beginner: { text: "#a9ecc9", bg: "rgba(169, 236, 201, 0.15)" },
  intermediate: { text: "#ffe49a", bg: "rgba(255, 228, 154, 0.15)" },
  advanced: { text: "#ffb6d9", bg: "rgba(255, 182, 217, 0.15)" },
  expert: { text: "#cdb9f7", bg: "rgba(205, 185, 247, 0.15)" },
};

function getStopState(
  slug: string,
  orderedSlugs: string[],
  completedStops: string[],
): "done" | "current" | "locked" {
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

  // The map is laid out in a fixed 720-unit coordinate space (the SVG road and
  // the absolutely-positioned HTML nodes share it). To fit narrow screens we
  // scale the WHOLE thing uniformly, so positions AND node sizes shrink together
  // - otherwise the px-positioned nodes (e.g. left: 360) land off a ~352px phone.
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const [mapScale, setMapScale] = useState(1);
  useEffect(() => {
    const el = mapWrapRef.current;
    if (!el) return;
    const update = () => setMapScale(Math.min(1, el.clientWidth / 720));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build the road from the curriculum: this track's lessons, in order.
  const stops = lessons
    .filter((l) => (l.language || "python") === track)
    .sort((a, b) => a.order - b.order);
  const orderedSlugs = stops.map((s) => s.slug);
  const nLessons = stops.length;

  // Interleave a "section challenge" node after the last lesson of every module
  // that has a difficulty-matched challenge mapped (getModuleChallenge). Read +
  // quiz modules (C#, Python read + quiz) have no mapping, so they get no node.
  type RoadItem =
    | { kind: "lesson"; lesson: Lesson; isFirstOfModule: boolean }
    | {
        kind: "challenge";
        challenge: Challenge;
        moduleName: string;
        moduleTier: keyof typeof TIER_COLORS;
        moduleSlugs: string[];
      };
  const roadItems: RoadItem[] = [];
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    const moduleName = stop.module || stop.chapter || "Basics";
    const isFirstOfModule = i === 0 || stops[i - 1].module !== stop.module;
    roadItems.push({ kind: "lesson", lesson: stop, isFirstOfModule });

    const isLastOfModule = i === stops.length - 1 || stops[i + 1].module !== stop.module;
    if (isLastOfModule) {
      const challenge = getModuleChallenge(moduleName);
      if (challenge) {
        roadItems.push({
          kind: "challenge",
          challenge,
          moduleName,
          moduleTier: (stop.tier || "beginner") as keyof typeof TIER_COLORS,
          moduleSlugs: stops
            .filter((s) => (s.module || s.chapter || "Basics") === moduleName)
            .map((s) => s.slug),
        });
      }
    }
  }
  const n = roadItems.length;

  // Vertical layout: START at the bottom, boss at the top, nodes evenly between.
  const startY = BOSS_Y + (n + 1) * GAP;
  const mapHeight = startY + 120;
  const nodeX = (j: number) => (j % 2 === 1 ? X_LEFT : X_RIGHT); // j is 1-based
  const nodeY = (j: number) => startY - j * GAP;

  // The dashed road: a smooth serpentine through START -> nodes -> boss.
  const points = [
    { x: X_CENTER, y: startY },
    ...roadItems.map((_, i) => ({ x: nodeX(i + 1), y: nodeY(i + 1) })),
    { x: X_CENTER, y: BOSS_Y },
  ];
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let k = 1; k < points.length; k++) {
    const a = points[k - 1];
    const b = points[k];
    const midY = (a.y + b.y) / 2;
    pathD += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }

  const chapterTitle =
    stops[0]?.chapter ||
    (track === "javascript" ? "JavaScript Climbs - Chapter 1" : "Python Basics - Chapter 1");
  const projectLabel =
    track === "javascript"
      ? "Chapter Project · Star Map"
      : track === "csharp"
        ? "Chapter Project · Console App"
        : track === "typescript"
          ? "Chapter Project · Typed Sky"
          : "Chapter Project · Sky House";

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
        <h1
          className="font-display glow-heading"
          style={{ fontWeight: 800, fontSize: 42, color: "#ffffff", margin: 0 }}
        >
          {chapterTitle}
        </h1>
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

      {/* the map - generated from the curriculum: start at the bottom, boss at the top */}
      <div ref={mapWrapRef} className="relative z-5" style={{ width: "min(720px, 94vw)", height: mapHeight * mapScale, margin: "10px auto 0" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 720, height: mapHeight, transformOrigin: "top left", transform: `scale(${mapScale})` }}>
        <svg
          viewBox={`0 0 720 ${mapHeight}`}
          className="absolute inset-0 h-full w-full"
          style={{ overflow: "visible", filter: "drop-shadow(0 0 10px rgba(255,190,240,.45))" }}
        >
          <path
            d={pathD}
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
          style={{ left: X_CENTER, top: startY, transform: "translate(-50%,-50%)", gap: 2 }}
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

        {/* nodes, generated from the curriculum: lessons plus a section challenge
            at the end of each module that has a difficulty-matched challenge */}
        {roadItems.map((item, i) => {
          const j = i + 1;

          if (item.kind === "challenge") {
            const { challenge, moduleSlugs } = item;
            const moduleComplete = moduleSlugs.every((s) => completed.includes(s));
            const cleared = completed.includes(challenge.slug);
            const state: "done" | "current" | "locked" = cleared
              ? "done"
              : moduleComplete
                ? "current"
                : "locked";
            const sub = cleared
              ? "Section challenge cleared"
              : moduleComplete
                ? `Section challenge · ${challenge.level}`
                : "Finish the module to unlock";
            return (
              <MapNode
                key={`challenge-${challenge.slug}`}
                left={nodeX(j)}
                top={nodeY(j)}
                state={state}
                title={challenge.name}
                sub={sub}
                href={`/challenge/${challenge.slug}`}
                cloud={NODE_CLOUDS[i % NODE_CLOUDS.length]}
                variant="challenge"
              />
            );
          }

          const stop = item.lesson;
          const lessonNumber = orderedSlugs.indexOf(stop.slug) + 1;
          const state = getStopState(stop.slug, orderedSlugs, completed);
          const sub =
            state === "done"
              ? "Complete"
              : state === "current"
                ? `Lesson ${lessonNumber} of ${nLessons} · ${lessonNumber === 1 ? "Start" : "Continue"} →`
                : "Locked";

          const moduleName = stop.module || stop.chapter || "Basics";
          const moduleTier = stop.tier || "beginner";
          const colors = TIER_COLORS[moduleTier as keyof typeof TIER_COLORS] || TIER_COLORS.beginner;

          return (
            <Fragment key={stop.slug}>
              {item.isFirstOfModule && (
                <div
                  className="absolute z-10 flex flex-col items-center gap-1 backdrop-blur-md"
                  style={{
                    left: X_CENTER,
                    top: nodeY(j) + GAP / 2,
                    transform: "translate(-50%, -50%)",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    padding: "10px 24px",
                    borderRadius: 20,
                    boxShadow: "0 8px 32px 0 rgba(20, 16, 50, 0.3)",
                  }}
                >
                  <span
                    className="font-display text-[10px] font-black tracking-widest"
                    style={{
                      color: colors.text,
                      background: colors.bg,
                      padding: "2px 8px",
                      borderRadius: 99,
                      border: `1px solid ${colors.text}33`,
                      textShadow: `0 0 8px ${colors.text}66`,
                    }}
                  >
                    {moduleTier.toUpperCase()}
                  </span>
                  <h2
                    className="font-display font-extrabold text-white"
                    style={{ fontSize: 14, margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                  >
                    {moduleName}
                  </h2>
                </div>
              )}
              <MapNode
                left={nodeX(j)}
                top={nodeY(j)}
                state={state}
                title={`${stop.order} · ${stop.catalogTitle}`}
                sub={sub}
                href={`/lesson/${stop.slug}`}
                cloud={NODE_CLOUDS[i % NODE_CLOUDS.length]}
              />
            </Fragment>
          );
        })}

        {/* boss: the Sky House on a big neon cloud */}
        <div
          className="absolute z-4"
          style={{ left: X_CENTER, top: BOSS_Y, transform: "translate(-50%,-50%)" }}
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
              {projectLabel}
            </div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#ffd9ef", textShadow: "0 0 10px rgba(255,138,222,.6)" }}>
              Build a tiny program of your own
            </div>
          </Link>
        </div>
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
  variant = "lesson",
}: {
  left: number;
  top: number;
  state: "done" | "current" | "locked";
  title: string;
  sub: string;
  href?: string;
  cloud: string;
  variant?: "lesson" | "challenge";
}) {
  const isChallenge = variant === "challenge";
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
            background: isChallenge ? "#ffe49a" : "#a9ecc9",
            border: "4px solid #ffffff",
            boxShadow: isChallenge
              ? "0 0 20px rgba(255,228,154,.6), 0 10px 26px rgba(20,12,50,.4)"
              : "0 0 20px rgba(169,236,201,.55), 0 10px 26px rgba(20,12,50,.4)",
            fontWeight: 900,
            fontSize: 20,
            color: isChallenge ? "#7a5200" : "#0f5c38",
            marginBottom: -22,
          }}
        >
          {isChallenge ? "★" : "✓"}
        </div>
      )}
      {state === "current" && (
        <div
          className="font-display anim-pulse-ring relative z-2 flex items-center justify-center"
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: isChallenge
              ? "linear-gradient(135deg, #ffd86b, #ff9e3d)"
              : "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
            border: "4px solid #ffffff",
            boxShadow: isChallenge
              ? "0 0 28px rgba(255,180,80,.75), 0 12px 30px rgba(20,12,50,.45)"
              : "0 0 28px rgba(255,100,200,.75), 0 12px 30px rgba(20,12,50,.45)",
            fontWeight: 800,
            fontSize: isChallenge ? 24 : 15,
            color: "#ffffff",
            marginBottom: -26,
          }}
        >
          {isChallenge ? "★" : "GO"}
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
            color: state === "locked" ? "rgba(255,255,255,.9)" : "#ffffff",
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
                ? "rgba(255,255,255,.8)"
                : state === "current"
                  ? isChallenge
                    ? "#ffe9b0"
                    : "#ffd9ef"
                  : isChallenge
                    ? "#ffe49a"
                    : "#b9f5d2",
            textShadow:
              state === "current"
                ? isChallenge
                  ? "0 0 10px rgba(255,180,80,.6)"
                  : "0 0 10px rgba(255,138,222,.6)"
                : undefined,
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
        className="dc-journey-node absolute flex cursor-pointer flex-col items-center transition-transform duration-200 hover:scale-105"
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
