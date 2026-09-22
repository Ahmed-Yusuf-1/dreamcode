import Cloud from "@/components/Cloud";

type CloudPreset = "drift" | "calm" | "map" | "none";

const PRESETS: Record<Exclude<CloudPreset, "none">, Parameters<typeof Cloud>[0][]> = {
  // Four clouds framing a content column.
  drift: [
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-11.webp", speed: 0.05, pos: { left: "-7%", top: "8%" }, width: "min(460px, 36vw)", opacity: 0.8, duration: 15 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-13.webp", speed: 0.1, pos: { right: "-5%", top: "30%" }, width: "min(360px, 28vw)", opacity: 0.78, duration: 12, delay: 1.2 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp", speed: 0.14, pos: { left: "3%", bottom: "6%" }, width: "min(290px, 23vw)", opacity: 0.75, anim: "floatySm", duration: 10, delay: 0.6 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp", speed: 0.1, pos: { right: "-2%", bottom: "4%" }, width: "min(300px, 24vw)", opacity: 0.68, anim: "floatySm", duration: 12, delay: 1.1 },
  ],
  // Two quiet clouds behind focused work (lessons, drills, editors).
  calm: [
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-14.webp", speed: 0.08, pos: { right: "-4%", top: "4%" }, width: "min(400px, 30vw)", opacity: 0.75, duration: 16 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-16.webp", speed: 0.05, pos: { left: "-5%", bottom: "5%" }, width: "min(360px, 27vw)", opacity: 0.7, duration: 18, delay: 2 },
  ],
  // Clouds scattered down a tall page (the journey road).
  map: [
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-11.webp", speed: 0.05, pos: { left: "-6%", top: "3%" }, width: "min(480px, 38vw)", opacity: 0.75, duration: 15 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp", speed: 0.09, pos: { right: "-5%", top: "10%" }, width: "min(400px, 32vw)", opacity: 0.7, duration: 12, delay: 1.4 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-09.webp", speed: 0.11, pos: { right: "-4%", top: "40%" }, width: "min(300px, 24vw)", opacity: 0.6, duration: 14, delay: 0.3 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-13.webp", speed: 0.12, pos: { left: "-4%", top: "62%" }, width: "min(280px, 22vw)", opacity: 0.6, anim: "floatySm", duration: 12, delay: 0.8 },
    { src: "/assets/clouds-sunset/cutout-cloud-sunset-14.webp", speed: 0.16, pos: { left: "3%", top: "82%" }, width: "min(300px, 24vw)", opacity: 0.65, anim: "floatySm", duration: 10, delay: 1 },
  ],
};

/**
 * The page root for every route: the themed day/night sky (see globals.css
 * tokens), a cloud preset, and horizontal clipping so drifting clouds never
 * create sideways scroll.
 */
export default function Scene({
  clouds = "drift",
  cloudScale = 1,
  className,
  style,
  children,
}: {
  clouds?: CloudPreset;
  /** Per-page cloud visibility (from src/lib/theme.ts cloudOpacity). */
  cloudScale?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div className={`dc-scene${className ? ` ${className}` : ""}`} style={style}>
      {clouds !== "none" &&
        PRESETS[clouds].map((cloud, i) => <Cloud key={i} {...cloud} scale={cloudScale} />)}
      {children}
    </div>
  );
}
