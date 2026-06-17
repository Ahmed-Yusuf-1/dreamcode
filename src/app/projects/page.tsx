"use client";

import Link from "next/link";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import SceneTopBar, { GlassPill } from "@/components/SceneTopBar";
import { projects } from "@/lib/data";
import { useUserProfile } from "@/lib/profile";
import { useActiveTrack } from "@/lib/track";

import { useEffect } from "react";

const TIERS = [
  { name: "Guided", blurb: "We sketch the rooms, you build the house. Step-by-step, but every line is yours." },
  { name: "Independent", blurb: "A goal and a test suite - the plan, the code and the bugs are all yours." },
  { name: "Capstone", blurb: "The big one. Real-world scale, your name on it, portfolio-ready." },
] as const;

const cs = cloudOpacity.projects;
export default function ProjectsPage() {
  const { profile } = useUserProfile();
  const completed = profile.completedStops || [];

  useEffect(() => {
    document.title = "Projects - dreamcode";
  }, []);

  const getProjectState = (id: string, lang: string): "done" | "current" | "locked" => {
    if (completed.includes(id)) return "done";
    
    if (id === "sky-house") {
      return "current";
    }
    if (id === "cloud-diary") {
      return completed.includes("sky-house") ? "current" : "locked";
    }
    if (id === "star-map") {
      return "current";
    }
    if (id === "weather-window") {
      return completed.includes("cloud-diary") ? "current" : "locked";
    }
    if (id === "dream-api") {
      return completed.includes("weather-window") && completed.includes("star-map") ? "current" : "locked";
    }
    return "locked";
  };

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #355a9e 0%, #6E8FC7 36%, #b9a3cf 70%, #F0AABE 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-10.webp" speed={0.06} pos={{ left: "-7%", top: "6%" }} width="min(520px, 40vw)" opacity={0.8} duration={14} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp" speed={0.12} pos={{ right: "-5%", top: "40%" }} width="min(380px, 30vw)" opacity={0.75} duration={11} delay={1.2} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.09} pos={{ right: "3%", top: "8%" }} width="min(280px, 23vw)" opacity={0.62} duration={13} delay={0.6} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-14.webp" speed={0.18} pos={{ left: "3%", bottom: "5%" }} width="min(300px, 24vw)" opacity={0.7} anim="floatySm" duration={10} delay={0.5} scale={cs} />

      <SceneTopBar right={<GlassPill href="/journey">Journey map →</GlassPill>} />

      <div className="relative z-5 mx-auto" style={{ maxWidth: 1000, padding: "4vh 32px 90px" }}>
        <div className="text-center" style={{ marginBottom: 44 }}>
          <h2
            className="font-display glow-heading"
            style={{ fontWeight: 800, fontSize: 46, color: "#ffffff", margin: "0 0 10px" }}
          >
            Build something real
          </h2>
          <p
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 2px 16px rgba(40,40,100,.7)",
              maxWidth: 540,
              margin: "0 auto",
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            Lessons teach you the bricks - projects make you lay them. The scaffolding fades a
            little more with every tier.
          </p>
        </div>

        {TIERS.map((tier) => {
          const tierProjects = projects.filter((p) => p.tier === tier.name);
          return (
            <div key={tier.name} style={{ marginBottom: 40 }}>
              <div className="flex items-baseline" style={{ gap: 14, marginBottom: 6 }}>
                <h3
                  className="font-display"
                  style={{ fontWeight: 800, fontSize: 27, color: "#ffffff", margin: 0, textShadow: "0 2px 14px rgba(40,40,100,.6)" }}
                >
                  {tier.name}
                </h3>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,.85)" }}>{tier.blurb}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16, marginTop: 14 }}>
                {tierProjects.map((p) => {
                  const state = getProjectState(p.id, p.language);
                  const locked = state === "locked";
                  const card = (
                    <div
                      className={`glass h-full${locked ? "" : " glow-hover"}`}
                      style={{
                        borderRadius: 20,
                        padding: "22px 24px",
                        boxShadow: "0 16px 40px rgba(40,40,100,.28)",
                        opacity: locked ? 0.55 : 1,
                      }}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                        <span
                          style={{
                            background: "rgba(255,255,255,.85)",
                            color: "#41608f",
                            fontWeight: 900,
                            fontSize: 11,
                            padding: "4px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {p.language}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 900, color: "#ffe49a", textShadow: "0 0 8px rgba(255,228,154,.7)" }}>
                          +{p.xp} XP
                        </span>
                      </div>
                      <div
                        className="font-display"
                        style={{ fontWeight: 800, fontSize: 21, color: "#ffffff", textShadow: "0 2px 10px rgba(40,40,100,.5)" }}
                      >
                        {p.title}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.92)", margin: "6px 0 0", lineHeight: 1.6 }}>
                        {p.desc}
                      </p>
                      <div style={{ marginTop: 12, fontSize: 12, fontWeight: 900, color: locked ? "rgba(255,255,255,.65)" : "#ffe7f4" }}>
                        {locked 
                          ? "Locked \u00b7 unlocks further down the road" 
                          : state === "done" 
                            ? "Completed! Build again \u2192" 
                            : "Start building \u2192"}
                      </div>
                    </div>
                  );

                  return locked ? (
                    <div key={p.id}>{card}</div>
                  ) : (
                    <Link key={p.id} href={`/project/${p.id}`} className="block transition-transform hover:-translate-y-1">
                      {card}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
