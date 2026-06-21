"use client";

import { useEffect } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import SceneTopBar, { GlassPill } from "@/components/SceneTopBar";
import { getModules } from "@/lib/curriculum";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { useUserProfile } from "@/lib/profile";

const cs = cloudOpacity.lessons;

const TIER_COLORS = {
  beginner: { text: "#a9ecc9", bg: "rgba(169, 236, 201, 0.15)" },
  intermediate: { text: "#ffe49a", bg: "rgba(255, 228, 154, 0.15)" },
  advanced: { text: "#ffb6d9", bg: "rgba(255, 182, 217, 0.15)" },
  expert: { text: "#cdb9f7", bg: "rgba(205, 185, 247, 0.15)" },
};

export default function LessonsPage() {
  const { track, setTrack } = useActiveTrack();
  const { profile } = useUserProfile();
  const modules = getModules(track);
  const firstLesson = modules[0]?.lessons[0];

  useEffect(() => {
    document.title = "Lessons - dreamcode";
  }, []);

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

      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-10.webp" speed={0.07} pos={{ left: "-7%", top: "10%" }} width="min(560px, 44vw)" opacity={0.88} duration={14} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.13} pos={{ right: "-6%", top: "34%" }} width="min(420px, 33vw)" opacity={0.9} duration={11} delay={1.2} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp" speed={0.24} pos={{ left: "4%", bottom: "6%" }} width="300px" opacity={0.95} anim="floatySm" duration={9} delay={0.5} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.1} pos={{ right: "6%", bottom: "4%" }} width="min(280px, 23vw)" opacity={0.7} anim="floatySm" duration={11} delay={1.4} neon="magenta" scale={cs} />

      <div
        className="pointer-events-none absolute inset-0 z-2"
        style={{ background: "linear-gradient(180deg, #6E8FC7 0%, #F0AABE 100%)", opacity: gradientOpacity.lessons }}
      />

      <SceneTopBar
        right={
          <div className="flex" style={{ gap: 10 }}>
            <GlassPill href="/industry">Industry uses {"\u2192"}</GlassPill>
            <GlassPill href="/journey">Journey map {"\u2192"}</GlassPill>
          </div>
        }
      />

      <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 1080, padding: "5vh 32px 90px" }}>
        <h1
          className="font-display glow-heading"
          style={{ fontWeight: 800, fontSize: 48, color: "#ffffff", margin: "0 0 10px" }}
        >
          Lessons above the clouds
        </h1>
        <p
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#ffffff",
            textShadow: "0 2px 16px rgba(60,60,130,.7)",
            margin: "0 auto 30px",
            maxWidth: 520,
            lineHeight: 1.6,
            textWrap: "pretty",
          }}
        >
          A guided road through Python, JavaScript, and C# - one small, glowing stop at a time.
        </p>

        {/* Tab Selector */}
        <div
          className="mx-auto flex justify-center"
          style={{
            gap: 12,
            marginBottom: 38,
            background: "rgba(24,20,70,.3)",
            padding: 6,
            borderRadius: 999,
            width: "max-content",
            border: "1px solid rgba(255,255,255,.16)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button
            onClick={() => setTrack("python")}
            style={{
              background: track === "python" ? "#ffffff" : "transparent",
              color: track === "python" ? "#13335f" : "rgba(255,255,255,.85)",
              fontWeight: 900,
              fontSize: 14,
              padding: "10px 24px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "all .25s ease",
              border: "none",
              boxShadow: track === "python" ? "0 4px 15px rgba(255,255,255,.2)" : "none",
            }}
          >
            Python (Basics)
          </button>
          <button
            onClick={() => setTrack("javascript")}
            style={{
              background: track === "javascript" ? "#ffffff" : "transparent",
              color: track === "javascript" ? "#13335f" : "rgba(255,255,255,.85)",
              fontWeight: 900,
              fontSize: 14,
              padding: "10px 24px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "all .25s ease",
              border: "none",
              boxShadow: track === "javascript" ? "0 4px 15px rgba(255,255,255,.2)" : "none",
            }}
          >
            JavaScript (Climbs)
          </button>
          <button
            onClick={() => setTrack("csharp")}
            style={{
              background: track === "csharp" ? "#ffffff" : "transparent",
              color: track === "csharp" ? "#13335f" : "rgba(255,255,255,.85)",
              fontWeight: 900,
              fontSize: 14,
              padding: "10px 24px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "all .25s ease",
              border: "none",
              boxShadow: track === "csharp" ? "0 4px 15px rgba(255,255,255,.2)" : "none",
            }}
          >
            C# (.NET)
          </button>
          <button
            onClick={() => setTrack("typescript")}
            style={{
              background: track === "typescript" ? "#ffffff" : "transparent",
              color: track === "typescript" ? "#13335f" : "rgba(255,255,255,.85)",
              fontWeight: 900,
              fontSize: 14,
              padding: "10px 24px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "all .25s ease",
              border: "none",
              boxShadow: track === "typescript" ? "0 4px 15px rgba(255,255,255,.2)" : "none",
            }}
          >
            TypeScript (Types)
          </button>
        </div>

        <div className="flex flex-col text-left" style={{ gap: 48 }}>
          {modules.map((mod) => {
            const colors = TIER_COLORS[mod.tier as keyof typeof TIER_COLORS] || TIER_COLORS.beginner;
            return (
              <section key={mod.name} className="flex flex-col" style={{ gap: 24 }}>
                <div
                  className="flex items-center gap-3 border-b pb-3"
                  style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.15)" }}
                >
                  <h2
                    className="font-display text-2xl font-black text-white"
                    style={{ textShadow: "0 2px 10px rgba(60,60,130,.5)" }}
                  >
                    {mod.name}
                  </h2>
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
                    {mod.tier.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 20 }}>
                  {mod.lessons.map((lesson) => (
                    <Link
                      key={lesson.slug}
                      href={`/lesson/${lesson.slug}`}
                      className="glass glow-hover block transition-transform hover:-translate-y-1"
                      style={{
                        backdropFilter: "blur(14px)",
                        borderRadius: 22,
                        padding: "26px 26px",
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
                        STOP {String(lesson.order).padStart(2, "0")}
                      </div>
                      <div
                        className="font-display flex items-center"
                        style={{
                          fontWeight: 800,
                          fontSize: 23,
                          color: "#ffffff",
                          margin: "8px 0 6px",
                          textShadow: "0 2px 12px rgba(60,60,130,.5)",
                          gap: 8,
                        }}
                      >
                        {profile.completedStops?.includes(lesson.slug) && (
                          <span style={{ color: "#a9ecc9", textShadow: "0 0 8px rgba(169,236,201,.6)" }}>✓</span>
                        )}
                        <span>{lesson.catalogTitle}</span>
                      </div>
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: "rgba(255,255,255,.95)",
                          fontWeight: 600,
                          margin: "0 0 14px",
                          textShadow: "0 1px 10px rgba(60,60,130,.5)",
                        }}
                      >
                        {lesson.blurb}
                      </p>
                      <div
                        className="font-mono"
                        style={{ fontSize: 13, color: "#fff3c9", textShadow: "0 0 8px rgba(255,228,154,.6)" }}
                      >
                        {lesson.catalogCode}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {firstLesson && (
          <Link
            href={`/lesson/${firstLesson.slug}`}
            className="font-display inline-block cursor-pointer transition-transform hover:-translate-y-[3px]"
            style={{
              marginTop: 42,
              border: "none",
              background: "rgba(255,255,255,.92)",
              color: "#5b3f78",
              fontWeight: 800,
              fontSize: 17,
              padding: "14px 32px",
              borderRadius: 999,
              boxShadow: "0 0 24px rgba(255,255,255,.5), 0 16px 36px rgba(60,60,130,.3)",
            }}
          >
            Start the first lesson {"\u2192"}
          </Link>
        )}
      </div>
    </div>
  );
}
