"use client";

import Link from "next/link";
import Scene from "@/components/ui/Scene";
import PageHeader from "@/components/ui/PageHeader";
import TrackPicker from "@/components/ui/TrackPicker";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { useUserProfile } from "@/lib/profile";
import { challengeUnlocked, getLessonMeta, trackLabel, type ChallengeMeta } from "@/lib/catalog";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export default function PeaksView() {
  const catalog = useCatalog();
  const { track } = useActiveTrack();
  const { profile } = useUserProfile();
  const completed = profile.completedStops || [];
  const done = new Set(completed);
  const peaks = catalog.challenges.filter((c) => c.track === track);
  const cleared = peaks.filter((c) => done.has(c.slug)).length;

  const lockReason = (c: ChallengeMeta) => {
    if (c.module) return `Finish the ${c.module} chapter`;
    if (c.requires) return `Finish the ${getLessonMeta(catalog, c.requires)?.catalogTitle ?? "earlier"} lesson`;
    return "Keep learning to unlock";
  };

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.peaks}>
      <div className="dc-bar">
        <nav className="dc-segmented" aria-label="Map view">
          <Link href="/journey" className="dc-segmented__option">
            Learning path
          </Link>
          <Link href="/peaks" className="dc-segmented__option" aria-current="page">
            Problem Peaks
          </Link>
        </nav>
        <span className="dc-chip dc-chip--solid">
          {cleared} of {peaks.length} cleared
        </span>
      </div>

      <div className="dc-container" style={{ maxWidth: 1000, paddingTop: "4vh", paddingBottom: 90 }}>
        <PageHeader
          title="Problem Peaks"
          lede="Standalone climbs for the skills you have learned. Each peak is a real problem with real tests: no rails, just your plan and your code."
        >
          <div className="flex justify-center" style={{ marginTop: 22 }}>
            <TrackPicker only={["python", "javascript", "typescript"]} />
          </div>
        </PageHeader>

        {track === "csharp" && (
          <div className="dc-glass text-center" style={{ padding: "22px 24px", marginBottom: 30 }}>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>
              C# peaks need a code sandbox
            </div>
            <p style={{ color: "var(--dc-on-sky-soft)", fontWeight: 700, margin: "6px 0 0" }}>
              C# runs on a server, not in your browser, so its graded peaks arrive with the sandbox. Until then each C# lesson ends in a quiz. Pick another track above to climb now.
            </p>
          </div>
        )}

        {LEVELS.map((level) => {
          const group = peaks.filter((c) => c.level === level);
          if (group.length === 0) return null;
          return (
            <section key={level} style={{ marginBottom: 38 }} aria-labelledby={`level-${level}`}>
              <h2 id={`level-${level}`} className="dc-section-title" style={{ marginBottom: 14 }}>
                {level}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
                {group.map((c) => {
                  const isDone = done.has(c.slug);
                  const open = isDone || challengeUnlocked(catalog, c, completed);
                  const body = (
                    <>
                      <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
                        <span className="dc-chip dc-chip--glass" style={{ fontSize: 11 }}>
                          {c.language}
                        </span>
                        {c.module && (
                          <span className="dc-chip dc-chip--glass" style={{ fontSize: 11 }}>
                            Section challenge
                          </span>
                        )}
                        <span className="dc-chip dc-chip--butter" style={{ fontSize: 11, marginLeft: "auto" }}>
                          +{c.xp} XP
                        </span>
                      </div>
                      <div className="font-display" style={{ fontWeight: 800, fontSize: 21, margin: "10px 0 4px", textShadow: "var(--dc-sky-text-shadow)" }}>
                        {isDone ? "✓ " : ""}
                        {c.name}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dc-on-sky-soft)", margin: 0, lineHeight: 1.55 }}>{c.blurb}</p>
                      <div className="font-display" style={{ marginTop: 12, fontSize: 14, fontWeight: 800, color: open ? "var(--dc-link)" : "var(--dc-on-sky-muted)" }}>
                        {isDone ? "Cleared · climb again" : open ? "Ready to climb →" : `Locked · ${lockReason(c)}`}
                      </div>
                    </>
                  );
                  return open ? (
                    <Link key={c.slug} href={`/challenge/${c.slug}`} className="dc-glass dc-depth-card dc-depth-card--interactive block" style={{ padding: "20px 22px" }}>
                      {body}
                    </Link>
                  ) : (
                    <div key={c.slug} className="dc-glass dc-locked block" style={{ padding: "20px 22px" }} aria-label={`${c.name}: locked. ${lockReason(c)}.`}>
                      {body}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {peaks.length > 0 && cleared === peaks.length && (
          <p className="dc-lede text-center">Every {trackLabel(track)} peak is cleared. Time to build a project.</p>
        )}
      </div>
    </Scene>
  );
}
