"use client";

import Link from "next/link";
import SceneTopBar, { GlassPill } from "@/components/SceneTopBar";
import { badges } from "@/lib/data";
import { useUserProfile } from "@/lib/profile";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";
import Cloud from "@/components/Cloud";

const cs = cloudOpacity.badges;
export default function BadgesPage() {
  const { profile } = useUserProfile();
  const mappedBadges = badges.map((b) => ({
    ...b,
    found: profile.unlockedBadges.includes(b.id),
  }));
  return (
    <div
      className="relative overflow-hidden"
      style={{ minHeight: "max(100vh, 880px)", background: "#5a3f8f" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/backgrounds/bg-rainbow-cloud-2.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 30%" }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-2"
        style={{
          background: "linear-gradient(180deg, #6E8FC7 0%, #9678BE 50%, #F0AABE 100%)",
          opacity: gradientOpacity.badges,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-3"
        style={{
          background:
            "linear-gradient(180deg, rgba(40,24,76,.3) 0%, rgba(40,24,76,.08) 38%, rgba(28,16,56,.42) 100%)",
        }}
      />

      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.07} pos={{ left: "-6%", top: "16%" }} width="min(380px, 30vw)" opacity={0.8} duration={14} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.12} pos={{ right: "-4%", bottom: "10%" }} width="min(320px, 26vw)" opacity={0.75} duration={11} delay={1.2} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.1} pos={{ right: "-5%", top: "8%" }} width="min(300px, 24vw)" opacity={0.7} duration={13} delay={0.6} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.16} pos={{ left: "3%", bottom: "-4%" }} width="min(260px, 22vw)" opacity={0.65} anim="floatySm" duration={10} delay={1} scale={cs} />

      <SceneTopBar
        right={<GlassPill>{profile.unlockedBadges.length} of {badges.length} found</GlassPill>}
      />

      <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 1060, padding: "4vh 32px 90px" }}>
        <h2
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: 48,
            color: "#ffffff",
            margin: "0 0 10px",
            textShadow:
              "0 0 8px rgba(255,255,255,.7), 0 0 30px rgba(189,128,255,.9), 0 0 60px rgba(110,230,255,.5)",
          }}
        >
          Collect the sky
        </h2>
        <p
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#ffffff",
            textShadow: "0 2px 16px rgba(30,16,60,.8)",
            margin: "0 auto 46px",
            maxWidth: 480,
            lineHeight: 1.6,
            textWrap: "pretty",
          }}
        >
          Every milestone earns a neon cloud for your collection - {badges.length} to find
          between here and your first real project.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: 16 }}>
          {mappedBadges.map((badge, i) => (
            <div
              key={badge.id}
              style={{
                background: "rgba(255,255,255,.13)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,.4)",
                borderRadius: 20,
                padding: "22px 14px 18px",
                boxShadow: "0 18px 44px rgba(30,16,60,.35)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={badge.img}
                alt=""
                className={badge.found ? "cloud-glow" : undefined}
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: 130,
                  height: "auto",
                  margin: "0 auto",
                  animation: badge.found
                    ? `floatySm ${7 + (i % 4) * 0.5}s ease-in-out ${(i % 5) * 0.3}s infinite`
                    : undefined,
                  filter: badge.found ? undefined : "grayscale(1) brightness(.55) opacity(.55)",
                }}
              />
              <div
                className="font-display"
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: badge.found ? "#ffffff" : "rgba(255,255,255,.55)",
                  marginTop: 12,
                  textShadow: "0 2px 10px rgba(30,16,60,.6)",
                }}
              >
                {badge.found ? badge.name : "???"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: badge.found ? "rgba(255,250,255,.88)" : "rgba(255,250,255,.5)",
                  marginTop: 3,
                }}
              >
                {badge.desc}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/journey"
          className="font-display inline-block cursor-pointer transition-transform hover:-translate-y-[3px]"
          style={{
            marginTop: 44,
            border: "none",
            background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 17,
            padding: "14px 32px",
            borderRadius: 999,
            boxShadow: "0 0 26px rgba(255,100,200,.6), 0 16px 36px rgba(30,16,60,.4)",
          }}
        >
          Earn the next one {"\u2192"}
        </Link>
      </div>
    </div>
  );
}
