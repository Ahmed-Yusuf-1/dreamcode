"use client";

import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TopLine from "@/components/ui/TopLine";
import PageHeader from "@/components/ui/PageHeader";
import TrackPicker from "@/components/ui/TrackPicker";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { useUserProfile } from "@/lib/profile";
import { getLessonMeta, projectUnlocked, trackLabel } from "@/lib/catalog";

const TIERS = [
  { name: "Guided", blurb: "We sketch the rooms, you build the house. Step by step, but every line is yours." },
  { name: "Independent", blurb: "A goal and a test suite. The plan, the code and the bugs are all yours." },
  { name: "Capstone", blurb: "The big one: a whole track of skills in one program." },
] as const;

export default function ProjectsView() {
  const catalog = useCatalog();
  const { track } = useActiveTrack();
  const { profile } = useUserProfile();
  const completed = profile.completedStops || [];
  const done = new Set(completed);
  const trackProjects = catalog.projects.filter((p) => p.track === track);

  const needsLabel = (keys: string[]) =>
    keys
      .filter((k) => !done.has(k))
      .map((k) => getLessonMeta(catalog, k)?.catalogTitle ?? catalog.projects.find((p) => p.id === k)?.title ?? k)
      .join(", ");

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.projects}>
      <TopLine back={{ href: "/dashboard", label: "Dashboard" }} right={<Link href="/journey" className="dc-pill">Journey map {"→"}</Link>} />
      <div className="dc-container" style={{ maxWidth: 1000, paddingTop: "4vh", paddingBottom: 90 }}>
        <PageHeader title="Build something real" lede="Lessons teach you the bricks. Projects make you lay them, and the scaffolding fades a little more with every tier.">
          <div className="flex justify-center" style={{ marginTop: 22 }}>
            <TrackPicker />
          </div>
        </PageHeader>

        {trackProjects.length === 0 && (
          <div className="dc-glass text-center" style={{ padding: "24px 26px", marginBottom: 34 }}>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>
              {trackLabel(track)} projects need a code sandbox
            </div>
            <p style={{ color: "var(--dc-on-sky-soft)", fontWeight: 700, margin: "6px 0 0" }}>
              Graded projects run your code, and C# cannot run in the browser yet. Your lessons and quizzes are all available now.
            </p>
          </div>
        )}

        {TIERS.map((tier) => {
          const list = trackProjects.filter((p) => p.tier === tier.name);
          if (list.length === 0) return null;
          return (
            <section key={tier.name} style={{ marginBottom: 38 }}>
              <div className="flex flex-wrap items-baseline" style={{ gap: 12, marginBottom: 14 }}>
                <h2 className="dc-section-title">{tier.name}</h2>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--dc-on-sky-soft)" }}>{tier.blurb}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
                {list.map((p) => {
                  const isDone = done.has(p.id);
                  const open = isDone || projectUnlocked(p, completed);
                  const body = (
                    <>
                      <div className="flex items-center justify-between" style={{ gap: 8 }}>
                        <span className="dc-chip dc-chip--glass" style={{ fontSize: 11 }}>
                          {p.language}
                        </span>
                        <span className="dc-chip dc-chip--butter" style={{ fontSize: 11 }}>
                          +{p.xp} XP
                        </span>
                      </div>
                      <div className="font-display" style={{ fontWeight: 800, fontSize: 22, margin: "10px 0 4px", textShadow: "var(--dc-sky-text-shadow)" }}>
                        {isDone ? "✓ " : ""}
                        {p.title}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dc-on-sky-soft)", margin: 0, lineHeight: 1.55 }}>{p.desc}</p>
                      <div className="font-display" style={{ marginTop: 12, fontSize: 14, fontWeight: 800, color: open ? "var(--dc-link)" : "var(--dc-on-sky-muted)" }}>
                        {isDone ? "Built · open it again" : open ? "Start building →" : `Locked · first finish ${needsLabel(p.requires)}`}
                      </div>
                    </>
                  );
                  return open ? (
                    <Link key={p.id} href={`/project/${p.id}`} className="dc-glass dc-depth-card dc-depth-card--interactive block" style={{ padding: "22px 24px" }}>
                      {body}
                    </Link>
                  ) : (
                    <div key={p.id} className="dc-glass dc-locked" style={{ padding: "22px 24px" }}>
                      {body}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </Scene>
  );
}
