import Link from "next/link";
import Scene from "@/components/ui/Scene";

export default function NotFound() {
  return (
    <Scene clouds="calm" className="flex items-center justify-center" style={{ padding: "40px 16px" }}>
      <div className="dc-glass dc-depth-card relative z-5 text-center" style={{ maxWidth: 480, padding: "38px 32px", borderRadius: 28 }}>
        <div className="font-display neon-title" style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>
          404
        </div>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: "12px 0 0" }}>
          That stop is not on this map
        </h1>
        <p style={{ fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: "10px 0 0", lineHeight: 1.6 }}>
          The page moved or never existed. Your progress is safe.
        </p>
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 24 }}>
          <Link href="/journey" className="dc-btn dc-btn--primary dc-btn--sm">
            Open the journey map
          </Link>
          <Link href="/" className="dc-btn dc-btn--secondary dc-btn--sm">
            Home
          </Link>
        </div>
      </div>
    </Scene>
  );
}
