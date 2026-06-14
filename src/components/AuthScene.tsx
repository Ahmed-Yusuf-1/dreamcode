"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";
import Cloud from "./Cloud";

/**
 * Shared login/signup scene: doorway-clouds background + frosted card.
 * Frontend-only - "submitting" just routes to the dashboard.
 */
const cs = cloudOpacity.auth;
export default function AuthScene({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  // New sign-ups get the guided first-run; returning logins go to the hub.
  const dest = isSignup ? "/start" : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(dest);
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,.92)",
    border: "2px solid rgba(255,255,255,.9)",
    borderRadius: 14,
    padding: "13px 16px",
    fontSize: 15,
    fontWeight: 700,
    color: "#13335f",
    outline: "none",
  };

  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh", background: "#6E8FC7" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/backgrounds/bg-doorway-clouds-1.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 50%" }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-2"
        style={{ background: "linear-gradient(180deg, #6E8FC7 0%, #F0AABE 100%)", opacity: gradientOpacity.auth }}
      />

      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.06} pos={{ left: "-8%", top: "10%" }} width="min(360px, 30vw)" opacity={0.7} duration={14} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.1} pos={{ right: "-6%", bottom: "12%" }} width="min(320px, 26vw)" opacity={0.7} duration={12} delay={1.1} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.14} pos={{ right: "4%", top: "8%" }} width="min(220px, 20vw)" opacity={0.6} anim="floatySm" duration={10} delay={0.6} scale={cs} />

      <div className="relative z-5 w-full" style={{ maxWidth: 420, padding: "40px 24px" }}>
        <div className="text-center" style={{ marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/clouds-neon/cutout-cloud-neon-1-03.webp"
            alt=""
            style={{
              display: "block",
              width: 74,
              height: "auto",
              margin: "0 auto 10px",
              filter: "drop-shadow(0 0 14px rgba(255,190,240,.85))",
              animation: "floatySm 6s ease-in-out infinite",
            }}
          />
          <div className="font-display neon-title" style={{ fontWeight: 800, fontSize: 38, color: "#fff6fb" }}>
            dreamcode
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", textShadow: "0 2px 14px rgba(30,30,80,.7)", margin: "8px 0 0" }}>
            {isSignup ? "A whole sky of code is waiting. It's free to start." : "Welcome back, night driver."}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="glass"
          style={{ borderRadius: 26, padding: "28px 28px", boxShadow: "0 24px 60px rgba(30,30,80,.35)" }}
        >
          {isSignup && (
            <input placeholder="What should the clouds call you?" style={{ ...fieldStyle, marginBottom: 12 }} />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ ...fieldStyle, marginBottom: 12 }}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ ...fieldStyle, marginBottom: 18 }}
          />
          <button
            type="submit"
            className="font-display w-full cursor-pointer transition-transform hover:-translate-y-0.5"
            style={{
              border: "none",
              background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: 17,
              padding: "14px 0",
              borderRadius: 999,
              boxShadow: "0 0 26px rgba(255,100,200,.55), 0 14px 32px rgba(40,16,60,.4)",
            }}
          >
            {isSignup ? "Start the night drive \u2192" : "Sign in \u2192"}
          </button>

          <div className="flex items-center" style={{ gap: 12, margin: "18px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.5)" }} />
            <span style={{ fontSize: 12, fontWeight: 900, color: "rgba(255,255,255,.85)" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.5)" }} />
          </div>

          <button
            type="button"
            onClick={() => router.push(dest)}
            className="w-full cursor-pointer transition-colors hover:bg-white"
            style={{
              background: "rgba(255,255,255,.92)",
              border: "none",
              color: "#13335f",
              fontWeight: 900,
              fontSize: 14.5,
              padding: "12px 0",
              borderRadius: 999,
            }}
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => router.push(dest)}
            className="w-full cursor-pointer transition-colors hover:bg-white"
            style={{
              background: "rgba(255,255,255,.92)",
              border: "none",
              color: "#13335f",
              fontWeight: 900,
              fontSize: 14.5,
              padding: "12px 0",
              borderRadius: 999,
              marginTop: 10,
            }}
          >
            Continue with GitHub
          </button>
        </form>

        <div className="text-center" style={{ marginTop: 18, fontSize: 14, fontWeight: 800, color: "#ffffff", textShadow: "0 2px 12px rgba(30,30,80,.7)" }}>
          {isSignup ? (
            <>
              Already dreaming?{" "}
              <Link href="/login" className="underline" style={{ color: "#ffd9ef" }}>
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to the sky?{" "}
              <Link href="/signup" className="underline" style={{ color: "#ffd9ef" }}>
                Start free
              </Link>
            </>
          )}
        </div>
        <div className="text-center" style={{ marginTop: 10 }}>
          <Link href="/" style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,.75)" }}>
            {"\u2190"} Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
