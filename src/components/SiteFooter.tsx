import Link from "next/link";
import Wordmark from "./Wordmark";

const LINKS: [string, string][] = [
  ["Lessons", "/lessons"],
  ["Journey", "/journey"],
  ["Problem Peaks", "/peaks"],
  ["Projects", "/projects"],
  ["Night review", "/review"],
  ["Where it's used", "/industry"],
  ["Profile", "/profile"],
];

/** The site-wide footer: brand, every destination, and the copyright line. */
export default function SiteFooter() {
  return (
    <footer style={{ position: "relative", zIndex: 5, borderTop: "1px solid rgba(255,255,255,.16)", background: "var(--dc-bar-bg)", backdropFilter: "blur(12px)" }}>
      <div
        className="mx-auto flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left"
        style={{ maxWidth: 1180, padding: "24px clamp(16px, 4vw, 32px) 28px" }}
      >
        <Wordmark size="sm" />
        <nav aria-label="Footer" className="flex flex-wrap justify-center" style={{ gap: "8px 18px" }}>
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="transition-colors hover:text-white" style={{ fontSize: 13.5, fontWeight: 800, color: "rgba(255,255,255,.78)" }}>
              {label}
            </Link>
          ))}
        </nav>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,.72)", whiteSpace: "nowrap" }}>
          {"©"} {new Date().getFullYear()} dreamcode {"·"} made above the clouds
        </div>
      </div>
    </footer>
  );
}
