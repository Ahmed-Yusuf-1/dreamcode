import type { Metadata } from "next";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import FlowSteps from "@/components/FlowSteps";
import Scene from "@/components/ui/Scene";
import TrackPicker from "@/components/ui/TrackPicker";
import { StartFirstLessonButton } from "@/components/JourneyCtas";
import { cloudOpacity } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Start here",
  description: "How dreamcode works in four steps, and your first lesson in about five minutes.",
};

export default function StartPage() {
  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.lessons}>
      <div className="dc-topline" style={{ paddingTop: 22 }}>
        <Wordmark size="sm" />
        <div className="flex flex-wrap justify-end" style={{ gap: 10 }}>
          <Link href="/placement" className="dc-pill">
            I have coded before
          </Link>
          <Link href="/dashboard" className="dc-pill">
            Skip to dashboard
          </Link>
        </div>
      </div>

      <div className="dc-container text-center" style={{ maxWidth: 920, paddingTop: "4vh", paddingBottom: 80 }}>
        <span className="dc-chip dc-chip--glass" style={{ letterSpacing: 2 }}>
          WELCOME
        </span>
        <h1 className="dc-title glow-heading" style={{ fontSize: "clamp(32px, 6vw, 46px)", margin: "18px 0 0" }}>
          Here is the whole thing,
          <br />
          start to finish.
        </h1>
        <p className="dc-lede" style={{ marginBottom: 26 }}>
          Four steps, on repeat. You will write real code in your very first lesson, with nothing to install.
        </p>

        <div className="flex flex-col items-center" style={{ gap: 10, marginBottom: 30 }}>
          <span className="dc-kicker">First, pick a language</span>
          <TrackPicker />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--dc-on-sky-muted)" }}>New to coding? Python is the friendliest first language.</span>
        </div>

        <div className="dc-glass" style={{ padding: "30px 22px 26px" }}>
          <FlowSteps current={0} />
        </div>

        <div className="flex flex-col items-center" style={{ marginTop: 38, gap: 14 }}>
          <StartFirstLessonButton />
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--dc-on-sky-muted)" }}>Takes about five minutes. Step 1 of 4.</div>
        </div>

        <ul className="flex flex-wrap justify-center" style={{ gap: 10, marginTop: 40, listStyle: "none", padding: 0 }}>
          {["No setup, ever", "Free to start", "You write the code, not us", "Stuck? A guide asks, never tells"].map((line) => (
            <li key={line} className="dc-chip dc-chip--glass dc-chip--lg">
              <span aria-hidden="true" className="flex items-center justify-center" style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--dc-mint)", color: "var(--dc-mint-ink)", fontSize: 11 }}>
                {"✓"}
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
