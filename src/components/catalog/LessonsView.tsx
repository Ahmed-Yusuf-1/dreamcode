"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TopLine from "@/components/ui/TopLine";
import PageHeader from "@/components/ui/PageHeader";
import TrackPicker from "@/components/ui/TrackPicker";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { useUserProfile } from "@/lib/profile";
import { getTrackModules, trackLabel, TRACKS } from "@/lib/catalog";

export default function LessonsView() {
  const catalog = useCatalog();
  const { track } = useActiveTrack();
  const { profile } = useUserProfile();
  const [query, setQuery] = useState("");
  const done = useMemo(() => new Set(profile.completedStops || []), [profile.completedStops]);
  const modules = getTrackModules(catalog, track);
  const allLessons = modules.flatMap((m) => m.lessons);
  const next = allLessons.find((l) => !done.has(l.slug));
  const q = query.trim().toLowerCase();
  const runtime = TRACKS.find((t) => t.id === track)?.runtime;

  const filtered = modules
    .map((m) => ({
      ...m,
      lessons: q
        ? m.lessons.filter((l) => `${l.catalogTitle} ${l.title} ${l.blurb} ${l.catalogCode}`.toLowerCase().includes(q))
        : m.lessons,
    }))
    .filter((m) => m.lessons.length > 0);

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.lessons}>
      <TopLine
        back={{ href: "/dashboard", label: "Dashboard" }}
        right={
          <>
            <Link href="/industry" className="dc-pill">Where it&apos;s used</Link>
            <Link href="/journey" className="dc-pill">Journey map {"→"}</Link>
          </>
        }
      />

      <div className="dc-container" style={{ maxWidth: 1100, paddingTop: "4vh", paddingBottom: 90 }}>
        <PageHeader
          title="Lessons above the clouds"
          lede={`${catalog.lessons.length} lessons across four languages. Pick a track and follow the chapters, one small, glowing stop at a time.`}
        >
          <div className="flex flex-col items-center" style={{ gap: 14, marginTop: 24 }}>
            <TrackPicker />
            <label className="block" style={{ width: "min(420px, 100%)" }}>
              <span className="sr-only">Search {trackLabel(track)} lessons</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${trackLabel(track)} lessons`}
                className="dc-search"
              />
            </label>
            {runtime === "quiz" && (
              <div className="dc-chip dc-chip--glass">C# lessons are read + quiz: study the example, then answer the questions.</div>
            )}
          </div>
        </PageHeader>

        {filtered.length === 0 && <p className="dc-lede text-center">No lessons match &ldquo;{query}&rdquo;.</p>}

        <div className="flex flex-col" style={{ gap: 44 }}>
          {filtered.map((mod) => {
            const fullModule = modules.find((m) => m.name === mod.name)!;
            const fullDone = fullModule.lessons.filter((l) => done.has(l.slug)).length;
            return (
              <section key={mod.name} aria-labelledby={`mod-${mod.chapter}`}>
                <div className="flex flex-wrap items-center" style={{ gap: 10, paddingBottom: 12, marginBottom: 18, borderBottom: "1px solid rgba(255,255,255,.18)" }}>
                  <span className="dc-kicker">Chapter {mod.chapter}</span>
                  <h2 id={`mod-${mod.chapter}`} className="dc-section-title">
                    {mod.name}
                  </h2>
                  <span className="dc-tier" data-tier={mod.tier}>
                    {mod.tier}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "var(--dc-on-sky-muted)" }}>
                    {fullDone}/{fullModule.lessons.length} done
                  </span>
                  {mod.challenge && (
                    <Link href={`/challenge/${mod.challenge.slug}`} className="dc-chip dc-chip--butter" title="The graded challenge that caps this chapter">
                      {done.has(mod.challenge.slug) ? "✓" : "★"} {mod.challenge.name}
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 18 }}>
                  {mod.lessons.map((lesson) => {
                    const isDone = done.has(lesson.slug);
                    const isNext = next?.slug === lesson.slug;
                    return (
                      <Link
                        key={lesson.slug}
                        href={`/lesson/${lesson.slug}`}
                        className="dc-glass dc-depth-card dc-depth-card--interactive flex flex-col"
                        style={{ padding: "22px 22px", outline: isNext ? "2px solid rgba(255,255,255,.85)" : undefined, outlineOffset: 3 }}
                      >
                        <div className="flex items-center justify-between" style={{ gap: 8 }}>
                          <span className="dc-kicker">Stop {String(lesson.order).padStart(2, "0")}</span>
                          {isDone ? (
                            <span className="dc-chip dc-chip--mint" style={{ fontSize: 11, padding: "3px 9px" }}>{"✓"} Done</span>
                          ) : isNext ? (
                            <span className="dc-chip dc-chip--solid" style={{ fontSize: 11, padding: "3px 9px" }}>Up next</span>
                          ) : !lesson.runnable ? (
                            <span className="dc-chip dc-chip--glass" style={{ fontSize: 11, padding: "3px 9px" }}>Quiz</span>
                          ) : null}
                        </div>
                        <div className="font-display" style={{ fontWeight: 800, fontSize: 22, margin: "8px 0 6px", textShadow: "var(--dc-sky-text-shadow)" }}>
                          {lesson.catalogTitle}
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--dc-on-sky-soft)", fontWeight: 600, margin: "0 0 14px", flex: 1 }}>{lesson.blurb}</p>
                        <div className="font-mono" style={{ fontSize: 12.5, color: "#fff3c9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {lesson.catalogCode}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {next && !q && (
          <div className="text-center" style={{ marginTop: 44 }}>
            <Link href={`/lesson/${next.slug}`} className="dc-btn dc-btn--primary dc-btn--lg">
              {done.size === 0 ? "Start the first lesson" : `Continue: ${next.catalogTitle}`} {"→"}
            </Link>
          </div>
        )}
      </div>
    </Scene>
  );
}
