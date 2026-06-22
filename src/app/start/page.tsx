import Link from "next/link";
import Cloud from "@/components/Cloud";
import Wordmark from "@/components/Wordmark";
import FlowSteps from "@/components/FlowSteps";
import { StartFirstLessonButton } from "@/components/JourneyCtas";
import { cloudOpacity } from "@/lib/theme";

const cs = cloudOpacity.lessons;

export default function StartPage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #191643 0%, #2b2c63 30%, #4c4096 70%, #6e5fae 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.06} pos={{ left: "-6%", top: "10%" }} width="min(360px, 30vw)" opacity={0.7} duration={14} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.1} pos={{ right: "-5%", top: "28%" }} width="min(320px, 26vw)" opacity={0.7} duration={12} delay={1.1} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.14} pos={{ left: "2%", bottom: "6%" }} width="min(280px, 22vw)" opacity={0.6} anim="floatySm" duration={10} delay={0.6} scale={cs} />

      {/* top bar */}
      <div className="relative z-6 flex items-center justify-between" style={{ padding: "24px 44px" }}>
        <Wordmark size="sm" />
        <Link
          href="/dashboard"
          className="cursor-pointer backdrop-blur-md transition-colors hover:bg-white/30"
          style={{
            background: "rgba(255,255,255,.16)",
            border: "2px solid rgba(255,255,255,.6)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 13,
            padding: "9px 18px",
            borderRadius: 999,
          }}
        >
          I know my way around
        </Link>
      </div>

      <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 900, padding: "3vh 28px 80px" }}>
        <div
          className="inline-block"
          style={{
            background: "rgba(255,255,255,.14)",
            border: "1px solid rgba(255,255,255,.35)",
            borderRadius: 999,
            padding: "7px 18px",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: 2,
            color: "#ffd9ef",
          }}
        >
          WELCOME
        </div>
        <h1
          className="font-display glow-heading"
          style={{ fontWeight: 800, fontSize: "min(46px, 9vw)", color: "#ffffff", margin: "18px 0 12px", lineHeight: 1.1 }}
        >
          Here is the whole thing,
          <br />
          start to finish.
        </h1>
        <p
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "rgba(255,255,255,.88)",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.65,
            textWrap: "pretty",
          }}
        >
          Four steps, on repeat. That is all there is to it. You will write real code in your very
          first lesson, with nothing to install.
        </p>

        {/* the path */}
        <div
          className="glass"
          style={{ borderRadius: 26, padding: "34px 28px 30px", boxShadow: "0 24px 60px rgba(10,8,40,.4)" }}
        >
          <FlowSteps current={0} />
        </div>

        {/* one clear primary action - routes to the learner's actual first/next lesson */}
        <div className="flex flex-col items-center" style={{ marginTop: 40, gap: 14 }}>
          <StartFirstLessonButton />
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.7)" }}>
            Takes about five minutes. Step 1 of 4.
          </div>
        </div>

        {/* reassurance row */}
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 44 }}>
          {[
            "No setup, ever",
            "Free to start",
            "You write the code, not us",
            "Stuck? A guide asks, never tells",
          ].map((line) => (
            <div
              key={line}
              className="glass flex items-center"
              style={{ gap: 8, borderRadius: 999, padding: "10px 18px" }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#a9ecc9",
                  color: "#0f5c38",
                  fontWeight: 900,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "#ffffff" }}>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
