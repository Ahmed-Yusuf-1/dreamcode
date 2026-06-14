import Link from "next/link";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import StreakFlame from "@/components/StreakFlame";
import { peaks, user } from "@/lib/data";

export const metadata = {
  title: "Problem Peaks - dreamcode",
  description: "Standalone climbs for the skills you've learned. Each peak is a real problem with real tests - no rails, just your plan and the night sky.",
};

const cs = cloudOpacity.peaks;
export default function PeaksPage() {
  return (
    <div
      className="relative"
      style={{
        minHeight: "100vh",
        overflowX: "clip",
        background:
          "linear-gradient(180deg, #1a1c52 0%, #38357e 26%, #6e5fae 52%, #b58fc6 76%, #f0aabe 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-11.webp" speed={0.06} pos={{ left: "-6%", top: "6%" }} width="min(460px, 36vw)" opacity={0.75} duration={15} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.11} pos={{ right: "-5%", top: "30%" }} width="min(380px, 30vw)" opacity={0.8} duration={12} delay={1.1} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.09} pos={{ right: "1%", bottom: "12%" }} width="min(300px, 24vw)" opacity={0.7} duration={13} delay={0.7} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.18} pos={{ left: "2%", bottom: "8%" }} width="min(320px, 26vw)" opacity={0.8} anim="floatySm" duration={10} delay={0.4} scale={cs} />

      {/* spacer to clear the fixed global nav */}
      <div style={{ height: "var(--nav-h)" }} />

      {/* HUD - sits just under the global nav */}
      <div
        className="sticky z-20 flex flex-wrap items-center justify-between backdrop-blur-lg"
        style={{
          top: "var(--nav-h)",
          gap: 14,
          padding: "12px clamp(16px, 4vw, 32px)",
          background: "rgba(24,20,70,.5)",
          borderBottom: "1px solid rgba(255,255,255,.18)",
        }}
      >
        <div
          className="flex"
          style={{
            gap: 6,
            background: "rgba(255,255,255,.14)",
            padding: 5,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,.25)",
          }}
        >
          <Link
            href="/journey"
            className="cursor-pointer transition-colors hover:bg-white/18"
            style={{
              color: "rgba(255,255,255,.9)",
              fontWeight: 900,
              fontSize: 13,
              padding: "8px 18px",
              borderRadius: 999,
            }}
          >
            Basics Path
          </Link>
          <span
            style={{
              background: "#ffffff",
              color: "#13335f",
              fontWeight: 900,
              fontSize: 13,
              padding: "8px 18px",
              borderRadius: 999,
            }}
          >
            Problem Peaks
          </span>
        </div>

        <div
          className="flex items-center"
          style={{ gap: 8, background: "rgba(255,255,255,.92)", padding: "7px 14px", borderRadius: 999 }}
        >
          <StreakFlame />
          <span style={{ fontWeight: 900, fontSize: 13, color: "#9c4a14" }}>{user.streak}</span>
        </div>
      </div>

      <div className="relative z-5 mx-auto" style={{ maxWidth: 980, padding: "44px 28px 90px" }}>
        <div className="text-center" style={{ marginBottom: 40 }}>
          <h2
            className="font-display glow-heading"
            style={{ fontWeight: 800, fontSize: 44, color: "#ffffff", margin: "0 0 10px" }}
          >
            Problem Peaks
          </h2>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "rgba(255,255,255,.92)",
              textShadow: "0 2px 14px rgba(30,16,60,.7)",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.6,
              textWrap: "pretty",
            }}
          >
            Standalone climbs for the skills you&apos;ve learned. Each peak is a real problem with
            real tests - no rails, just your plan and the night sky.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 18 }}>
          {peaks.map((peak) => {
            const locked = peak.state === "locked";
            const card = (
              <div
                className={`glass h-full${locked ? "" : " glow-hover"}`}
                style={{
                  borderRadius: 22,
                  padding: "24px 26px",
                  boxShadow: "0 18px 44px rgba(20,12,50,.3)",
                  opacity: locked ? 0.55 : 1,
                }}
              >
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <span
                      style={{
                        background: peak.level === "Beginner" ? "#d9f5e6" : peak.level === "Intermediate" ? "#fff3c9" : "#ffe1ef",
                        color: peak.level === "Beginner" ? "#0f5c38" : peak.level === "Intermediate" ? "#7a5410" : "#a13163",
                        fontWeight: 900,
                        fontSize: 11,
                        padding: "4px 10px",
                        borderRadius: 999,
                      }}
                    >
                      {peak.level}
                    </span>
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
                      {peak.language}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 900, color: "#ffe49a", textShadow: "0 0 8px rgba(255,228,154,.7)" }}>
                    +{peak.xp} XP
                  </span>
                </div>
                <div
                  className="font-display"
                  style={{ fontWeight: 800, fontSize: 22, color: "#ffffff", textShadow: "0 2px 10px rgba(30,16,60,.6)" }}
                >
                  {peak.state === "done" && "✓ "}
                  {peak.name}
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.92)", margin: "6px 0 0", lineHeight: 1.6 }}>
                  {peak.blurb}
                </p>
                <div style={{ marginTop: 12, fontSize: 12, fontWeight: 900, color: locked ? "rgba(255,255,255,.6)" : "#ffd9ef" }}>
                  {locked
                    ? "Locked · climb the earlier peaks first"
                    : peak.state === "done"
                      ? "Summited · climb again?"
                      : "Ready to climb \u2192"}
                </div>
              </div>
            );

            return locked ? (
              <div key={peak.id}>{card}</div>
            ) : (
              <Link
                key={peak.id}
                href="/challenge/cloud-hopper"
                className="block transition-transform hover:-translate-y-1"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
