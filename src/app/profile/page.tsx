"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import SceneTopBar, { GlassPill } from "@/components/SceneTopBar";
import StreakFlame from "@/components/StreakFlame";
import { useUserProfile, useIsSignedIn } from "@/lib/profile";
import { useActiveTrack } from "@/lib/track";

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
  const { profile, updateProfile } = useUserProfile();
  const { track, setTrack } = useActiveTrack();
  const signedIn = useIsSignedIn();
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    document.title = "Profile - dreamcode";
  }, []);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setEvents(data.events || []);
        setLoadingEvents(false);
      })
      .catch(() => {
        setLoadingEvents(false);
      });
  }, []);

  const lessonsCompletedCount = events.filter((e) => e.name === "lesson_completed").length;
  const challengesPassedCount = events.filter((e) => e.name === "challenge_passed").length;
  const codeRunsCount = events.filter((e) => e.name === "code_run").length;

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

      <SceneTopBar
        back={{ href: "/dashboard", label: "\u2190 Dashboard" }}
        right={
          signedIn ? (
            // Real sign out: POST to the route that clears the Supabase session
            // cookies server-side, then redirects home. Only shown when signed in.
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="cursor-pointer text-white backdrop-blur-md transition-colors hover:bg-white/38"
                style={{
                  background: "rgba(255,255,255,.2)",
                  border: "2px solid rgba(255,255,255,.7)",
                  fontWeight: 900,
                  fontSize: 13,
                  padding: "9px 18px",
                  borderRadius: 999,
                }}
              >
                Sign out
              </button>
            </form>
          ) : (
            <GlassPill href="/login">Sign in</GlassPill>
          )
        }
      />

      {!signedIn && (
        <div className="relative z-6 mx-auto" style={{ maxWidth: 640, padding: "0 28px", marginTop: 2 }}>
          <div
            className="glass flex flex-wrap items-center justify-between"
            style={{ borderRadius: 18, padding: "13px 18px", gap: 10, boxShadow: "0 12px 30px rgba(15,12,50,.3)" }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#ffffff", lineHeight: 1.5 }}>
              You are exploring as a guest. Progress is saved on this device only.
            </div>
            <div className="flex" style={{ gap: 8 }}>
              <Link
                href="/login"
                className="cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,.95)", color: "#5b3f78", fontWeight: 800, fontSize: 12.5, padding: "7px 14px", borderRadius: 999, whiteSpace: "nowrap" }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="cursor-pointer transition-colors hover:bg-white/30"
                style={{ background: "rgba(255,255,255,.16)", border: "1.5px solid rgba(255,255,255,.6)", color: "#ffffff", fontWeight: 800, fontSize: 12.5, padding: "7px 14px", borderRadius: 999, whiteSpace: "nowrap" }}
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}

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
            {profile.initial}
          </div>
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 28, color: "#ffffff", margin: "14px 0 0", textShadow: "0 2px 12px rgba(20,16,50,.6)" }}>
            {profile.name}
          </h1>
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.85)", marginTop: 2 }}>
            Level {profile.level} {"\u00b7"} {signedIn ? "night driver since June 2026" : "browsing as a guest"}
          </div>
          <div className="flex justify-center" style={{ gap: 12, marginTop: 18 }}>
            <div className="flex items-center" style={{ gap: 7, background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999 }}>
              <StreakFlame />
              <span style={{ fontWeight: 900, fontSize: 13, color: "#9c4a14" }}>{profile.streak}-day streak</span>
            </div>
            <div style={{ background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999, fontWeight: 900, fontSize: 13, color: "#5b4a8a" }}>
              {profile.unlockedBadges.length} badges
            </div>
            <div style={{ background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999, fontWeight: 900, fontSize: 13, color: "#13335f" }}>
              {(profile.level - 1) * 800 + profile.xp} XP
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
            <Toggle on={profile.guideEnabled} onChange={(v) => updateProfile({ guideEnabled: v })} />
          </div>

          <div className="flex items-center justify-between" style={{ gap: 16, marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>Night review reminders</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.5, marginTop: 2 }}>
                A gentle nudge when memories drift back and your streak is at risk.
              </div>
            </div>
            <Toggle on={profile.remindersEnabled} onChange={(v) => updateProfile({ remindersEnabled: v })} />
          </div>

          <div className="flex items-center justify-between" style={{ gap: 16 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>Sound effects</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.5, marginTop: 2 }}>
                Soft chimes for passing tests and earning badges.
              </div>
            </div>
            <Toggle on={profile.soundsEnabled} onChange={(v) => updateProfile({ soundsEnabled: v })} />
          </div>
        </div>

        {/* track */}
        <div className="glass" style={{ borderRadius: 26, padding: "26px 28px", marginTop: 18, boxShadow: "0 20px 50px rgba(15,12,50,.4)" }}>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 19, color: "#ffffff", marginBottom: 14, textShadow: "0 2px 10px rgba(20,16,50,.6)" }}>
            Your track
          </div>
          <div className="flex flex-wrap" style={{ gap: 10 }}>
            <button
              onClick={() => setTrack("python")}
              style={{
                background: track === "python" ? "#ffffff" : "rgba(255,255,255,.12)",
                border: track === "python" ? "2px solid #ffffff" : "2px solid rgba(255,255,255,.3)",
                color: track === "python" ? "#13335f" : "rgba(255,255,255,.85)",
                fontWeight: 900,
                fontSize: 13,
                padding: "9px 18px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              Python (Basics)
            </button>
            <button
              onClick={() => setTrack("javascript")}
              style={{
                background: track === "javascript" ? "#ffffff" : "rgba(255,255,255,.12)",
                border: track === "javascript" ? "2px solid #ffffff" : "2px solid rgba(255,255,255,.3)",
                color: track === "javascript" ? "#13335f" : "rgba(255,255,255,.85)",
                fontWeight: 900,
                fontSize: 13,
                padding: "9px 18px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              JavaScript (Climbs)
            </button>
            <button
              onClick={() => setTrack("csharp")}
              style={{
                background: track === "csharp" ? "#ffffff" : "rgba(255,255,255,.12)",
                border: track === "csharp" ? "2px solid #ffffff" : "2px solid rgba(255,255,255,.3)",
                color: track === "csharp" ? "#13335f" : "rgba(255,255,255,.85)",
                fontWeight: 900,
                fontSize: 13,
                padding: "9px 18px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              C# (.NET)
            </button>
            <button
              onClick={() => setTrack("typescript")}
              style={{
                background: track === "typescript" ? "#ffffff" : "rgba(255,255,255,.12)",
                border: track === "typescript" ? "2px solid #ffffff" : "2px solid rgba(255,255,255,.3)",
                color: track === "typescript" ? "#13335f" : "rgba(255,255,255,.85)",
                fontWeight: 900,
                fontSize: 13,
                padding: "9px 18px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              TypeScript (Types)
            </button>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)", lineHeight: 1.6 }}>
            Not sure where you belong?{" "}
            <Link href="/placement" className="underline" style={{ color: "#ffd9ef", fontWeight: 800 }}>
              Take the placement flight
            </Link>{" "}
            and we&apos;ll drop you at the right stop.
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass" style={{ borderRadius: 26, padding: "26px 28px", marginTop: 18, boxShadow: "0 20px 50px rgba(15,12,50,.4)" }}>
          <div className="font-display" style={{ fontWeight: 800, fontSize: 19, color: "#ffffff", marginBottom: 18, textShadow: "0 2px 10px rgba(20,16,50,.6)" }}>
            Recent Activity
          </div>

          {loadingEvents ? (
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "rgba(255,255,255,.7)", padding: "10px 0" }}>
              Loading flight logs...
            </div>
          ) : (
            <>
              {/* Counts section */}
              <div className="grid grid-cols-3 text-center" style={{ gap: 10, marginBottom: 22 }}>
                <div style={{ background: "rgba(255,255,255,.08)", padding: "12px 8px", borderRadius: 16, border: "1px solid rgba(255,255,255,.1)" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#ff7ad9", textShadow: "0 0 10px rgba(255,122,217,.4)" }}>
                    {lessonsCompletedCount}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.8)", marginTop: 2 }}>
                    Lessons Done
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,.08)", padding: "12px 8px", borderRadius: 16, border: "1px solid rgba(255,255,255,.1)" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#ffd275", textShadow: "0 0 10px rgba(255,210,117,.4)" }}>
                    {challengesPassedCount}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.8)", marginTop: 2 }}>
                    Challenges
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,.08)", padding: "12px 8px", borderRadius: 16, border: "1px solid rgba(255,255,255,.1)" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#a9ecc9", textShadow: "0 0 10px rgba(169,236,201,.4)" }}>
                    {codeRunsCount}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,.8)", marginTop: 2 }}>
                    Code Runs
                  </div>
                </div>
              </div>

              {/* Timeline list */}
              {events.length === 0 ? (
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "rgba(255,255,255,.65)", padding: "10px 0" }}>
                  No recent flight entries recorded. Keep exploring to fill the logs.
                </div>
              ) : (
                <div className="flex flex-col" style={{ gap: 14 }}>
                  {events.slice(0, 30).map((e, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between"
                      style={{
                        paddingBottom: index === Math.min(events.length, 30) - 1 ? 0 : 12,
                        borderBottom: index === Math.min(events.length, 30) - 1 ? "none" : "1px solid rgba(255,255,255,.1)",
                        gap: 12,
                      }}
                    >
                      <div className="flex items-start" style={{ gap: 10 }}>
                        {/* Event icon dot */}
                        <span
                          style={{
                            flexShrink: 0,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: getEventColor(e.name),
                            marginTop: 7,
                            boxShadow: `0 0 8px ${getEventColor(e.name)}`,
                          }}
                        />
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#ffffff", lineHeight: 1.4 }}>
                          {formatEvent(e)}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          fontWeight: 800,
                          color: "rgba(255,255,255,.6)",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {formatTime(e.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface TelemetryEvent {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  createdAt: string;
}

function getEventColor(name: string) {
  switch (name) {
    case "signup":
    case "login":
      return "#ff7ad9"; // Pink
    case "lesson_started":
    case "challenge_started":
      return "#cdb9f7"; // Purple
    case "lesson_completed":
    case "practice_completed":
    case "project_completed":
      return "#a9ecc9"; // Green
    case "challenge_passed":
      return "#ffd275"; // Gold
    case "code_run":
      return "#ffd275"; // Yellow
    case "hint_requested":
      return "#ff8ba8"; // Red/Coral
    case "track_switched":
    case "placement_completed":
    default:
      return "#e2ecf7"; // Light white/blue
  }
}

function formatEvent(e: TelemetryEvent) {
  const p = e.props || {};
  switch (e.name) {
    case "signup":
      return "Joined the night drive";
    case "login":
      return "Signed in";
    case "lesson_started":
      return `Started lesson: ${p.slug || "Unknown"}`;
    case "lesson_completed":
      return `Completed lesson: ${p.slug || "Unknown"}`;
    case "code_run":
      return `Ran code in ${p.slug || "Unknown"} (${p.ok ? "success" : "error"})`;
    case "practice_completed":
      return `Completed practice: ${p.slug || "Unknown"}`;
    case "challenge_started":
      return `Started challenge: ${p.slug || "Unknown"}`;
    case "challenge_passed":
      return `Passed challenge: ${p.slug || "Unknown"}`;
    case "project_completed":
      return `Completed project: ${p.slug || "Unknown"}`;
    case "hint_requested":
      return `Requested hint on ${p.context || "general"}`;
    case "placement_completed":
      return `Completed placement quiz (${p.track || "unknown"} track)`;
    case "track_switched":
      return `Switched track to ${p.track || "unknown"}`;
    case "review_rated":
      return `Reviewed card: grade ${p.rating || "unknown"}`;
    default:
      return `${e.name} event`;
  }
}

function formatTime(isoString: string) {
  try {
    const d = new Date(isoString);
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.getDate();
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    return `${month} ${day}, ${time}`;
  } catch {
    return "";
  }
}
