"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TrackPicker from "@/components/ui/TrackPicker";
import StreakFlame from "@/components/StreakFlame";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { currentStreak, useUserProfile } from "@/lib/profile";
import { getTrackModules, lessonState, moduleComplete, trackLabel, type ChallengeMeta, type LessonMeta, type ModuleMeta, type ProgressState } from "@/lib/catalog";

const NODE_CLOUDS = [
  "/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp",
  "/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp",
  "/assets/clouds-neon/cutout-cloud-neon-1-01.webp",
  "/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp",
  "/assets/clouds-neon/cutout-cloud-neon-1-02.webp",
];

// Map layout. The map is drawn in a fixed coordinate space and scaled to fit.
// Phones get a narrower space so labels stay readable after scaling, and every
// chapter start reserves extra height so its banner never covers a stop.
const WIDE = { width: 720, gap: 165, banner: 90, xLeft: 190, xRight: 530, cloud: 180, cloudCurrent: 220, label: 240 };
const COMPACT = { width: 400, gap: 150, banner: 76, xLeft: 118, xRight: 282, cloud: 120, cloudCurrent: 150, label: 176 };
type MapLayout = typeof WIDE;
const BOSS_Y = 170;
/** Extra clearance between the last stop and the project cloud at the top. */
const BOSS_CLEARANCE = 90;

type RoadItem =
  | { kind: "lesson"; lesson: LessonMeta; mod: ModuleMeta; firstOfModule: boolean }
  | { kind: "challenge"; challenge: ChallengeMeta; mod: ModuleMeta };

export default function JourneyView() {
  const catalog = useCatalog();
  const { track, ready: trackReady } = useActiveTrack();
  const { profile, ready } = useUserProfile();
  const completed = profile.completedStops || [];
  const done = new Set(completed);
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLAnchorElement>(null);
  const [wrapWidth, setWrapWidth] = useState(720);
  const scrolledFor = useRef<string | null>(null);

  useEffect(() => {
    const el = mapWrapRef.current;
    if (!el) return;
    const update = () => setWrapWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const modules = getTrackModules(catalog, track);
  const items: RoadItem[] = [];
  for (const mod of modules) {
    mod.lessons.forEach((lesson, i) => items.push({ kind: "lesson", lesson, mod, firstOfModule: i === 0 }));
    if (mod.challenge) items.push({ kind: "challenge", challenge: mod.challenge, mod });
  }
  const lessons = modules.flatMap((m) => m.lessons);
  const doneCount = lessons.filter((l) => done.has(l.slug)).length;
  const current = lessons.find((l) => !done.has(l.slug));
  const currentModule = current ? modules.find((m) => m.name === current.module) : null;
  const project = catalog.projects.find((p) => p.track === track && !done.has(p.id)) ?? catalog.projects.find((p) => p.track === track);

  // Bring the learner's current stop into view once progress is known.
  useEffect(() => {
    if (!ready || !trackReady) return;
    const key = `${track}:${current?.slug ?? "end"}`;
    if (scrolledFor.current === key) return;
    scrolledFor.current = key;
    const t = setTimeout(() => {
      if (current && doneCount > 0) currentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }, 250);
    return () => clearTimeout(t);
  }, [ready, trackReady, track, current, doneCount]);

  const layout: MapLayout = wrapWidth < 560 ? COMPACT : WIDE;
  const mapScale = Math.min(1, wrapWidth / layout.width);
  const xCenter = layout.width / 2;
  // Distance of each stop above the start, with room for chapter banners.
  const rise: number[] = [];
  let climbed = 0;
  for (const item of items) {
    climbed += layout.gap + (item.kind === "lesson" && item.firstOfModule ? layout.banner : 0);
    rise.push(climbed);
  }
  const startY = BOSS_Y + climbed + layout.gap + BOSS_CLEARANCE;
  const mapHeight = startY + 130;
  const nodeX = (j: number) => (j % 2 === 1 ? layout.xLeft : layout.xRight);
  const nodeY = (j: number) => startY - rise[j - 1];
  const bannerY = (j: number) => nodeY(j) + (layout.gap + layout.banner) / 2;
  const points = [{ x: xCenter, y: startY }, ...items.map((_, i) => ({ x: nodeX(i + 1), y: nodeY(i + 1) })), { x: xCenter, y: BOSS_Y }];
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let k = 1; k < points.length; k++) {
    const a = points[k - 1];
    const b = points[k];
    const midY = (a.y + b.y) / 2;
    pathD += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }

  return (
    <Scene clouds="map" cloudScale={cloudOpacity.journey}>
      <div className="dc-bar">
        <nav className="dc-segmented" aria-label="Map view">
          <Link href="/journey" className="dc-segmented__option" aria-current="page">
            Learning path
          </Link>
          <Link href="/peaks" className="dc-segmented__option">
            Problem Peaks
          </Link>
        </nav>
        <div className="flex items-center" style={{ gap: 12 }}>
          {current && doneCount > 0 && (
            <button type="button" className="dc-pill" onClick={() => currentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}>
              Jump to my stop
            </button>
          )}
          <span className="dc-chip dc-chip--solid" title="Daily streak">
            <StreakFlame /> {currentStreak(profile)}
          </span>
          <div className="hidden flex-col sm:flex" style={{ gap: 4, width: 160 }}>
            <div className="flex justify-between" style={{ fontSize: 11, fontWeight: 900, color: "#ffffff" }}>
              <span>Level {profile.level}</span>
              <span>
                {profile.xp} / {profile.xpNext} XP
              </span>
            </div>
            <div className="dc-progress" style={{ height: 8 }}>
              <div className="dc-progress__fill" style={{ width: `${Math.round((profile.xp / profile.xpNext) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <header className="dc-container text-center" style={{ paddingTop: 36 }}>
        <h1 className="dc-title glow-heading">The {trackLabel(track)} road</h1>
        <p className="dc-lede">
          {!ready
            ? " "
            : currentModule
              ? `Chapter ${currentModule.chapter} of ${modules.length}: ${currentModule.name}. ${doneCount} of ${lessons.length} stops done. It starts at the bottom and climbs.`
              : `Every stop cleared. The ${trackLabel(track)} project at the top is waiting.`}
        </p>
        <div className="flex justify-center" style={{ marginTop: 18 }}>
          <TrackPicker />
        </div>
      </header>

      <div ref={mapWrapRef} className="relative z-5" style={{ width: "min(720px, 94vw)", height: mapHeight * mapScale, margin: "10px auto 0" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: layout.width, height: mapHeight, transformOrigin: "top left", transform: `scale(${mapScale})` }}>
          <svg viewBox={`0 0 ${layout.width} ${mapHeight}`} className="absolute inset-0 h-full w-full" aria-hidden="true" style={{ overflow: "visible", filter: "drop-shadow(0 0 10px rgba(255,190,240,.45))" }}>
            <path d={pathD} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={7} strokeDasharray="2 20" strokeLinecap="round" />
          </svg>

          <div className="absolute flex flex-col items-center" style={{ left: xCenter, top: startY, transform: "translate(-50%,-50%)", gap: 2 }}>
            <span className="dc-chip dc-chip--solid dc-chip--lg">START HERE</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp" alt="" className="cloud-glow" style={{ display: "block", width: 190, height: "auto", animation: "floatySm 9s ease-in-out infinite" }} />
          </div>

          {items.map((item, i) => {
            const j = i + 1;
            if (item.kind === "challenge") {
              const cleared = done.has(item.challenge.slug);
              const open = moduleComplete(item.mod, completed);
              const state: ProgressState = cleared ? "done" : open ? "current" : "locked";
              return (
                <MapNode
                  key={`c-${item.challenge.slug}`}
                  left={nodeX(j)}
                  top={nodeY(j)}
                  state={state}
                  title={item.challenge.name}
                  sub={cleared ? "Section challenge cleared" : open ? `Section challenge · ${item.challenge.level}` : "Finish the chapter to unlock"}
                  href={`/challenge/${item.challenge.slug}`}
                  cloud={NODE_CLOUDS[i % NODE_CLOUDS.length]}
                  variant="challenge"
                  layout={layout}
                />
              );
            }
            const { lesson } = item;
            const state = lessonState(catalog, lesson, completed);
            const isCurrent = current?.slug === lesson.slug;
            const sub =
              state === "done"
                ? "Complete"
                : state === "current"
                  ? `${lesson.runnable ? "Lesson" : "Read + quiz"} · ${lesson.order === 1 ? "Start" : "Continue"} →`
                  : "Locked";
            return (
              <Fragment key={lesson.slug}>
                {item.firstOfModule && (
                  <div
                    className="absolute z-10 flex flex-col items-center"
                    style={{
                      left: xCenter,
                      top: bannerY(j),
                      // Absolutely positioned boxes shrink to the space left of the
                      // map edge; size to the content instead.
                      width: "max-content",
                      maxWidth: layout.width - 40,
                      textAlign: "center",
                      transform: "translate(-50%, -50%)",
                      padding: "8px 22px",
                      borderRadius: 18,
                      gap: 4,
                      background: "var(--dc-menu-bg)",
                      border: "1px solid var(--dc-glass-border)",
                      boxShadow: "var(--dc-card-shadow)",
                      color: "#ffffff",
                    }}
                  >
                    <span className="dc-tier" data-tier={item.mod.tier}>
                      Chapter {item.mod.chapter} {"·"} {item.mod.tier}
                    </span>
                    <h2 className="font-display" style={{ fontSize: 14, margin: 0, fontWeight: 800 }}>
                      {item.mod.name}
                    </h2>
                  </div>
                )}
                <MapNode
                  left={nodeX(j)}
                  top={nodeY(j)}
                  state={state}
                  title={`${lesson.order} · ${lesson.catalogTitle}`}
                  sub={sub}
                  href={`/lesson/${lesson.slug}`}
                  cloud={NODE_CLOUDS[i % NODE_CLOUDS.length]}
                  nodeRef={isCurrent ? currentRef : undefined}
                  layout={layout}
                />
              </Fragment>
            );
          })}

          <div className="absolute z-4" style={{ left: xCenter, top: BOSS_Y, transform: "translate(-50%,-50%)", width: Math.min(300, layout.width - 40) }}>
            <div className="flex flex-col items-center" style={{ animation: "floatySm 8s ease-in-out infinite" }}>
              <div className="relative z-2 flex flex-col items-center" style={{ marginBottom: -26 }} aria-hidden="true">
                <div style={{ width: 0, height: 0, borderLeft: "33px solid transparent", borderRight: "33px solid transparent", borderBottom: "24px solid #f78fb8", filter: "drop-shadow(0 0 12px rgba(255,150,210,.7))" }} />
                <div className="relative" style={{ width: 52, height: 42, background: "#ffc9dd", borderRadius: 6, boxShadow: "inset -10px 0 0 rgba(180,90,130,.22), 0 0 18px rgba(255,170,220,.5)" }}>
                  <div style={{ position: "absolute", width: 12, height: 16, background: "#8a4a64", borderRadius: 3, bottom: 0, left: "50%", transform: "translateX(-50%)" }} />
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/clouds-neon/cutout-cloud-neon-1-04.webp" alt="" className="cloud-glow" style={{ display: "block", width: 240, height: "auto" }} />
              <Link href={project ? `/project/${project.id}` : "/projects"} className="dc-glass dc-depth-card dc-depth-card--interactive block text-center" style={{ marginTop: 2, padding: "10px 20px", borderRadius: 16 }}>
                <div className="font-display" style={{ fontWeight: 800, fontSize: 16 }}>
                  {project ? `Project · ${project.title}` : "Build a project"}
                </div>
                <div className="dc-kicker" style={{ fontSize: 10.5 }}>
                  {project ? project.desc : "Put the whole road to work"}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: 70 }} />
    </Scene>
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
  nodeRef,
  layout,
}: {
  left: number;
  top: number;
  state: ProgressState;
  title: string;
  sub: string;
  href: string;
  cloud: string;
  variant?: "lesson" | "challenge";
  nodeRef?: React.Ref<HTMLAnchorElement>;
  layout: MapLayout;
}) {
  const isChallenge = variant === "challenge";
  const marker =
    state === "done" ? (
      <div
        className="relative z-2 flex items-center justify-center"
        aria-hidden="true"
        style={{ width: 50, height: 50, borderRadius: "50%", background: isChallenge ? "#ffe49a" : "#a9ecc9", border: "4px solid #ffffff", boxShadow: "0 10px 26px rgba(20,12,50,.4)", fontWeight: 900, fontSize: 20, color: isChallenge ? "#7a5200" : "#0f5c38", marginBottom: -22 }}
      >
        {isChallenge ? "★" : "✓"}
      </div>
    ) : state === "current" ? (
      <div
        className="font-display anim-pulse-ring relative z-2 flex items-center justify-center"
        aria-hidden="true"
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: isChallenge ? "linear-gradient(135deg, #ffd86b, #ff9e3d)" : "var(--dc-accent)",
          border: "4px solid #ffffff",
          boxShadow: "0 12px 30px rgba(20,12,50,.45)",
          fontWeight: 800,
          fontSize: isChallenge ? 24 : 15,
          color: "#ffffff",
          marginBottom: -26,
        }}
      >
        {isChallenge ? "★" : "GO"}
      </div>
    ) : (
      <div className="relative z-2 flex items-center justify-center" aria-hidden="true" style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,.45)", border: "4px solid rgba(255,255,255,.8)", marginBottom: -20 }}>
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <rect x="1.5" y="8" width="15" height="11" rx="3" fill="rgba(255,255,255,.95)" />
          <path d="M5 8V5.5a4 4 0 0 1 8 0V8" stroke="rgba(255,255,255,.95)" strokeWidth="2.6" />
        </svg>
      </div>
    );

  const inner = (
    <>
      {marker}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cloud}
        alt=""
        className={state === "locked" ? undefined : "cloud-glow"}
        style={{
          display: "block",
          width: state === "current" ? layout.cloudCurrent : layout.cloud,
          height: "auto",
          filter: state === "locked" ? "grayscale(1) brightness(1.3) opacity(.7)" : undefined,
          animation: state === "current" ? "floatySm 6s ease-in-out infinite" : undefined,
        }}
      />
      <div
        className="glass text-center"
        style={{
          padding: state === "current" ? "9px 18px" : "7px 15px",
          borderRadius: 16,
          maxWidth: layout.label,
          background: "var(--dc-glass-strong-bg)",
          opacity: state === "locked" ? 0.85 : 1,
        }}
      >
        <div className="font-display" style={{ fontWeight: state === "current" ? 800 : 700, fontSize: state === "current" ? 16 : 14.5, textShadow: "0 2px 10px rgba(20,12,50,.5)" }}>
          {title}
        </div>
        <div style={{ fontSize: 11, fontWeight: 900, color: state === "locked" ? "rgba(255,255,255,.8)" : isChallenge ? "#ffe49a" : state === "done" ? "#b9f5d2" : "var(--dc-kicker)" }}>{sub}</div>
      </div>
    </>
  );

  // A fixed width keeps nodes near the right edge from shrink-wrapping their labels.
  const style: React.CSSProperties = { left, top, width: layout.label, transform: "translate(-50%,-50%)", zIndex: 6 };
  if (state !== "locked") {
    return (
      <Link ref={nodeRef} href={href} className="dc-journey-node absolute flex cursor-pointer flex-col items-center transition-transform duration-200 hover:scale-105" style={style} aria-label={`${title}: ${sub}`}>
        {inner}
      </Link>
    );
  }
  return (
    <div className="absolute flex flex-col items-center" style={style} aria-label={`${title}: locked`}>
      {inner}
    </div>
  );
}
