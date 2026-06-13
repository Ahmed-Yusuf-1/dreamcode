"use client";

import { useState } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import SceneTopBar, { GlassPill } from "@/components/SceneTopBar";
import StreakFlame from "@/components/StreakFlame";
import { user } from "@/lib/data";

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="cursor-pointer"
      style={{
        width: 52,
        height: 30,
        borderRadius: 999,
        border: "2px solid rgba(255,255,255,.7)",
        background: on ? "linear-gradient(135deg, #a9ecc9, #7fd6a4)" : "rgba(255,255,255,.2)",
        position: "relative",
        transition: "background .2s ease",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 24 : 2,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#ffffff",
          boxShadow: "0 2px 8px rgba(20,16,50,.35)",
          transition: "left .2s ease",
        }}
      />
    </button>
  );
}

const cs = cloudOpacity.profile;
export default function ProfilePage() {
  const [guideOn, setGuideOn] = useState(true);
  const [remindersOn, setRemindersOn] = useState(true);
  const [soundsOn, setSoundsOn] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #2b2c63 0%, #4c4096 45%, #8E95CE 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.07} pos={{ right: "-5%", top: "10%" }} width="min(400px, 32vw)" opacity={0.62} duration={13} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp" speed={0.14} pos={{ left: "-3%", bottom: "8%" }} width="min(300px, 24vw)" opacity={0.6} anim="floatySm" duration={10} delay={0.8} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.1} pos={{ left: "-4%", top: "30%" }} width="min(260px, 22vw)" opacity={0.55} duration={12} delay={0.5} neon="cyan" scale={cs} />

      <SceneTopBar back={{ href: "/dashboard", label: "← Dashboard" }} right={<GlassPill href="/login">Sign out</GlassPill>} />

      <div className="relative z-5 mx-auto" style={{ maxWidth: 640, padding: "3vh 28px 90px" }}>
        {/* identity card */}
        <div className="glass text-center" style={{ borderRadius: 26, padding: "32px 30px", boxShadow: "0 20px 50px rgba(15,12,50,.4)" }}>
          <div
            className="font-display mx-auto flex items-center justify-center"
            style={{
              width: 86,
              height: 86,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ffb6d9, #cdb9f7)",
              border: "3px solid #ffffff",
              fontWeight: 800,
              color: "#ffffff",
              fontSize: 36,
              boxShadow: "0 0 30px rgba(255,170,230,.5)",
            }}
          >
            {user.initial}
          </div>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 28, color: "#ffffff", marginTop: 14, textShadow: "0 2px 12px rgba(20,16,50,.6)" }}>
            {user.name}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.85)", marginTop: 2 }}>
            Level {user.level} · night driver since June 2026
          </div>
          <div className="flex justify-center" style={{ gap: 12, marginTop: 18 }}>
            <div className="flex items-center" style={{ gap: 7, background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999 }}>
              <StreakFlame />
              <span style={{ fontWeight: 900, fontSize: 13, color: "#9c4a14" }}>{user.streak}-day streak</span>
            </div>
            <div style={{ background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999, fontWeight: 900, fontSize: 13, color: "#5b4a8a" }}>
              {user.badgesFound} badges
            </div>
            <div style={{ background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999, fontWeight: 900, fontSize: 13, color: "#13335f" }}>
              {user.xp} XP
            </div>
          </div>
        </div>

        {/* settings */}
        <div className="glass" style={{ borderRadius: 26, padding: "26px 28px", marginTop: 18, boxShadow: "0 20px 50px rgba(15,12,50,.4)" }}>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 19, color: "#ffffff", marginBottom: 18, textShadow: "0 2px 10px rgba(20,16,50,.6)" }}>
            How you fly
          </div>

          <div className="flex items-center justify-between" style={{ gap: 16, marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>Dream Guide (AI mentor)</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.5, marginTop: 2 }}>
                Asks Socratic questions when you&apos;re stuck - never writes your code. Fully
                optional; everything works with it off.
              </div>
            </div>
            <Toggle on={guideOn} onChange={setGuideOn} />
          </div>

          <div className="flex items-center justify-between" style={{ gap: 16, marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>Night review reminders</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.5, marginTop: 2 }}>
                A gentle nudge when memories drift back and your streak is at risk.
              </div>
            </div>
            <Toggle on={remindersOn} onChange={setRemindersOn} />
          </div>

          <div className="flex items-center justify-between" style={{ gap: 16 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>Sound effects</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.5, marginTop: 2 }}>
                Soft chimes for passing tests and earning badges.
              </div>
            </div>
            <Toggle on={soundsOn} onChange={setSoundsOn} />
          </div>
        </div>

        {/* track */}
        <div className="glass" style={{ borderRadius: 26, padding: "26px 28px", marginTop: 18, boxShadow: "0 20px 50px rgba(15,12,50,.4)" }}>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 19, color: "#ffffff", marginBottom: 14, textShadow: "0 2px 10px rgba(20,16,50,.6)" }}>
            Your track
          </div>
          <div className="flex" style={{ gap: 10 }}>
            <span
              style={{
                background: "#ffffff",
                color: "#13335f",
                fontWeight: 900,
                fontSize: 13,
                padding: "9px 18px",
                borderRadius: 999,
              }}
            >
              Python, Chapter 1
            </span>
            <span
              style={{
                background: "rgba(255,255,255,.18)",
                border: "1px solid rgba(255,255,255,.4)",
                color: "rgba(255,255,255,.85)",
                fontWeight: 900,
                fontSize: 13,
                padding: "9px 18px",
                borderRadius: 999,
              }}
            >
              JavaScript, coming soon
            </span>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.6 }}>
            Not sure where you belong?{" "}
            <Link href="/journey" className="underline" style={{ color: "#ffd9ef", fontWeight: 800 }}>
              Take the placement flight
            </Link>{" "}
            and we&apos;ll drop you at the right stop.
          </div>
        </div>
      </div>
    </div>
  );
}
