import Link from "next/link";

export default function Wordmark({
  size = "md",
  href = "/",
}: {
  size?: "sm" | "md";
  href?: string;
}) {
  const cloudW = size === "md" ? 52 : 42;
  const fontSize = size === "md" ? 24 : 20;
  return (
    <Link href={href} className="flex items-center" style={{ gap: size === "md" ? 11 : 10 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/clouds-neon/cutout-cloud-neon-1-03.webp"
        alt=""
        style={{
          display: "block",
          width: cloudW,
          height: "auto",
          filter: "drop-shadow(0 0 10px rgba(255,190,240,.8))",
        }}
      />
      <div
        className="font-display neon-wordmark"
        style={{ fontWeight: 800, fontSize, color: "#fff6fb" }}
      >
        dreamcode
      </div>
    </Link>
  );
}
