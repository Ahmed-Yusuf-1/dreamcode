import Parallax from "./Parallax";
import { cloudOpacityBoost } from "@/lib/theme";

/**
 * A drifting cloud cutout: absolute position + parallax + floaty animation,
 * matching the prototype's cloud layers.
 *
 * glow / neon control the drop-shadow around the cutout:
 *   glow={true}      → soft pink+cyan haze (default)
 *   neon="magenta"   → bright magenta neon outline (like the wordmark)
 *   neon="cyan"      → bright cyan neon outline
 *   glow={false}     → no glow
 *
 * scale further multiplies opacity (used for per-page cloud opacity control).
 */
export default function Cloud({
  src,
  speed = 0.1,
  pos,
  width,
  opacity = 0.85,
  anim = "floaty",
  duration = 13,
  delay = 0,
  glow = true,
  neon,
  scale = 1,
  fixed = false,
}: {
  src: string;
  speed?: number;
  pos: React.CSSProperties; // left/right/top/bottom
  width: string; // e.g. "min(440px, 34vw)"
  opacity?: number;
  anim?: "floaty" | "floatySm";
  duration?: number;
  delay?: number;
  glow?: boolean;
  neon?: "magenta" | "cyan";
  scale?: number;
  fixed?: boolean;
}) {
  const glowClass = neon
    ? neon === "magenta"
      ? "cloud-neon-magenta"
      : "cloud-neon-cyan"
    : glow
      ? "cloud-glow"
      : undefined;

  const finalOpacity = Math.min(1, opacity * cloudOpacityBoost * scale);

  // Skip rendering entirely when a page dials this cloud to ~invisible - saves
  // the decode + GPU layer cost for clouds the user has turned off.
  if (finalOpacity < 0.02) return null;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={glowClass}
      loading="lazy"
      decoding="async"
      style={{
        display: "block",
        width,
        height: "auto",
        opacity: finalOpacity,
        animation: `${anim} ${duration}s ease-in-out ${delay}s infinite`,
        willChange: "transform",
      }}
    />
  );

  if (fixed) {
    return (
      <div style={{ position: "fixed", zIndex: 1, pointerEvents: "none", ...pos }}>
        {img}
      </div>
    );
  }

  return (
    <Parallax speed={speed} style={{ position: "absolute", zIndex: 1, ...pos }}>
      {img}
    </Parallax>
  );
}
