import Link from "next/link";

/**
 * The sub-page top bar used on cloud scenes (Lessons, Badges, ...):
 * back pill on the left, wordmark in the middle, action on the right.
 */
export default function SceneTopBar({
  back = { href: "/", label: "\u2190 Home" },
  right,
}: {
  back?: { href: string; label: string };
  right?: React.ReactNode;
}) {
  return (
    <div
      className="relative z-6 flex items-center justify-between"
      style={{ padding: "20px clamp(16px, 4vw, 44px)", gap: 12 }}
    >
      <Link
        href={back.href}
        className="cursor-pointer text-white backdrop-blur-md transition-colors hover:bg-white/38"
        style={{
          background: "rgba(255,255,255,.2)",
          border: "2px solid rgba(255,255,255,.7)",
          fontWeight: 900,
          fontSize: 13,
          padding: "9px 18px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        {back.label}
      </Link>
      <div>{right}</div>
    </div>
  );
}

export function GlassPill({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    background: "rgba(255,255,255,.2)",
    border: "2px solid rgba(255,255,255,.7)",
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 13,
    padding: "9px 18px",
    borderRadius: 999,
  };
  if (href) {
    return (
      <Link href={href} className="cursor-pointer backdrop-blur-md transition-colors hover:bg-white/38" style={style}>
        {children}
      </Link>
    );
  }
  return (
    <div className="backdrop-blur-md" style={style}>
      {children}
    </div>
  );
}
