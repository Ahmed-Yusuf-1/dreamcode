"use client";

import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TopLine from "@/components/ui/TopLine";
import PageHeader from "@/components/ui/PageHeader";
import TrackPicker from "@/components/ui/TrackPicker";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { getIndustryProfile, industryProfiles } from "@/lib/industry";

export default function IndustryView() {
  const { track } = useActiveTrack();
  const profile = getIndustryProfile(track) ?? industryProfiles[0];

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.lessons}>
      <TopLine back={{ href: "/lessons", label: "Lessons" }} right={<Link href="/journey" className="dc-pill">Journey map {"→"}</Link>} />
      <div className="dc-container" style={{ maxWidth: 1080, paddingTop: "4vh", paddingBottom: 90 }}>
        <PageHeader title="Where these languages take you" lede="Real jobs and real products built with each language across the tech industry.">
          <div className="flex justify-center" style={{ marginTop: 22 }}>
            <TrackPicker label="Choose a language" />
          </div>
        </PageHeader>

        <section className="dc-glass" style={{ padding: "26px 28px", marginBottom: 22 }}>
          <div className="dc-kicker">{profile.tagline}</div>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 30, margin: "6px 0 10px", textShadow: "var(--dc-sky-text-shadow)" }}>
            {profile.name}
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--dc-on-sky-soft)", fontWeight: 600, margin: 0, textWrap: "pretty" }}>{profile.summary}</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 18 }}>
          {profile.domains.map((d) => (
            <section key={d.title} className="dc-glass" style={{ padding: "22px 22px" }}>
              <h3 className="font-display" style={{ fontWeight: 800, fontSize: 19, margin: "0 0 8px" }}>
                {d.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--dc-on-sky-soft)", fontWeight: 600, margin: "0 0 14px" }}>{d.blurb}</p>
              <div className="dc-kicker" style={{ marginBottom: 7 }}>
                Tools
              </div>
              <div className="flex flex-wrap" style={{ gap: 7, marginBottom: 14 }}>
                {d.tools.map((tool) => (
                  <span key={tool} className="dc-chip dc-chip--solid font-mono" style={{ fontSize: 11.5, padding: "4px 10px" }}>
                    {tool}
                  </span>
                ))}
              </div>
              <div className="dc-kicker" style={{ marginBottom: 6 }}>
                Roles
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#ffffff" }}>{d.roles.join("  ·  ")}</div>
            </section>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: 36 }}>
          <Link href="/lessons" className="dc-btn dc-btn--primary dc-btn--lg">
            Start the {profile.name} lessons {"→"}
          </Link>
        </div>
      </div>
    </Scene>
  );
}
