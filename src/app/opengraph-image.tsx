import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", background: "linear-gradient(145deg, #090d26, #514094 58%, #ee8e73)", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: 112, fontWeight: 800, textShadow: "0 0 28px #ff7ad9" }}>dreamcode</div>
      <div style={{ marginTop: 24, fontSize: 34, fontWeight: 700, letterSpacing: 8 }}>LEARN · SOLVE · DREAM</div>
      <div style={{ marginTop: 34, fontSize: 27, opacity: 0.9 }}>Tiny lessons. Glowing problems. One neon mile at a time.</div>
    </div>,
    size,
  );
}
