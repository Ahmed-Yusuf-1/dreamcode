"use client";

import { useEffect, useState } from "react";
import Cloud from "@/components/Cloud";
import SceneTopBar, { GlassPill } from "@/components/SceneTopBar";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { industryProfiles, getIndustryProfile, type IndustryProfile } from "@/lib/industry";

const cs = cloudOpacity.lessons;

const TABS: { id: IndustryProfile["id"]; label: string }[] = [
  { id: "python", label: "Python" },
  { id: "javascript", label: "JavaScript" },
  { id: "csharp", label: "C# / .NET" },
];

export default function IndustryPage() {
  const { track } = useActiveTrack();
  const [active, setActive] = useState<IndustryProfile["id"]>(
    track === "javascript" ? "javascript" : "python",
  );

  useEffect(() => {
    document.title = "Where these languages are used - dreamcode";
  }, []);

  const profile = getIndustryProfile(active) ?? industryProfiles[0];

  return (
    <div
      className="relative overflow-hidden"
      style={{ minHeight: "max(100vh, 860px)", background: "#8E95CE" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/backgrounds/bg-hero-cloudsea-sunset.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 62%" }}
      />

      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-10.webp" speed={0.07} pos={{ left: "-7%", top: "10%" }} width="min(540px, 42vw)" opacity={0.85} duration={14} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.13} pos={{ right: "-6%", top: "30%" }} width="min(420px, 33vw)" opacity={0.9} duration={11} delay={1.2} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.1} pos={{ right: "5%", bottom: "5%" }} width="min(280px, 23vw)" opacity={0.7} anim="floatySm" duration={11} delay={1.4} neon="magenta" scale={cs} />

      <div
        className="pointer-events-none absolute inset-0 z-2"
        style={{ background: "linear-gradient(180deg, #6E8FC7 0%, #F0AABE 100%)", opacity: gradientOpacity.lessons }}
      />

      <SceneTopBar
        back={{ href: "/lessons", label: "← Lessons" }}
        right={<GlassPill href="/journey">Journey map {"→"}</GlassPill>}
      />

      <div className="relative z-5 mx-auto" style={{ maxWidth: 1080, padding: "4vh 32px 90px" }}>
        <div className="text-center">
          <h1
            className="font-display glow-heading"
            style={{ fontWeight: 800, fontSize: 46, color: "#ffffff", margin: "0 0 10px" }}
          >
            Where these languages take you
          </h1>
          <p
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 2px 16px rgba(60,60,130,.7)",
              margin: "0 auto 30px",
              maxWidth: 580,
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            Real jobs and real products built with each language across the tech industry.
          </p>

          {/* tab selector */}
          <div
            className="mx-auto flex flex-wrap justify-center"
            style={{
              gap: 10,
              marginBottom: 34,
              background: "rgba(24,20,70,.3)",
              padding: 6,
              borderRadius: 999,
              width: "max-content",
              maxWidth: "100%",
              border: "1px solid rgba(255,255,255,.16)",
              backdropFilter: "blur(12px)",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={{
                  background: active === t.id ? "#ffffff" : "transparent",
                  color: active === t.id ? "#13335f" : "rgba(255,255,255,.85)",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "10px 22px",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "all .25s ease",
                  border: "none",
                  boxShadow: active === t.id ? "0 4px 15px rgba(255,255,255,.2)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* selected language: tagline + summary */}
        <div
          className="glass"
          style={{
            backdropFilter: "blur(14px)",
            borderRadius: 22,
            padding: "26px 28px",
            marginBottom: 24,
            boxShadow: "0 18px 44px rgba(60,60,130,.25)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 1.5,
              color: "#ffe7f4",
              textShadow: "0 0 10px rgba(255,138,222,.8)",
            }}
          >
            {profile.tagline.toUpperCase()}
          </div>
          <div
            className="font-display"
            style={{ fontWeight: 800, fontSize: 30, color: "#ffffff", margin: "6px 0 10px", textShadow: "0 2px 12px rgba(60,60,130,.5)" }}
          >
            {profile.name}
          </div>
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.7,
              color: "rgba(255,255,255,.95)",
              fontWeight: 600,
              margin: 0,
              textShadow: "0 1px 10px rgba(60,60,130,.5)",
              textWrap: "pretty",
            }}
          >
            {profile.summary}
          </p>
        </div>

        {/* domains grid */}
        <div className="grid grid-cols-1 text-left md:grid-cols-2" style={{ gap: 18 }}>
          {profile.domains.map((d) => (
            <div
              key={d.title}
              className="glass"
              style={{
                backdropFilter: "blur(14px)",
                borderRadius: 20,
                padding: "22px 22px",
                boxShadow: "0 14px 36px rgba(60,60,130,.22)",
              }}
            >
              <div
                className="font-display"
                style={{ fontWeight: 800, fontSize: 19, color: "#ffffff", margin: "0 0 8px", textShadow: "0 2px 12px rgba(60,60,130,.5)" }}
              >
                {d.title}
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,.92)",
                  fontWeight: 600,
                  margin: "0 0 14px",
                  textShadow: "0 1px 10px rgba(60,60,130,.5)",
                  textWrap: "pretty",
                }}
              >
                {d.blurb}
              </p>

              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, color: "rgba(255,255,255,.7)", marginBottom: 7 }}>
                TOOLS
              </div>
              <div className="flex flex-wrap" style={{ gap: 7, marginBottom: 14 }}>
                {d.tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#13335f",
                      background: "rgba(255,255,255,.82)",
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1, color: "rgba(255,255,255,.7)", marginBottom: 6 }}>
                ROLES
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ffe7f4", textShadow: "0 0 10px rgba(255,138,222,.6)" }}>
                {d.roles.join("  ·  ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
