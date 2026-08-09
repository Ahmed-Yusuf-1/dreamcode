import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: "var(--dc-page-sky)" }}>
      <div className="glass dc-depth-card max-w-lg text-center" style={{ borderRadius: 28, padding: "38px 32px" }}>
        <div className="font-display text-6xl text-white">404</div>
        <h1 className="font-display mt-2 text-2xl text-white">That stop is not on this map</h1>
        <p className="mt-3 font-bold text-white/80">Head back to your journey and choose another cloud.</p>
        <Link href="/journey" className="dc-pressable mt-6 inline-block rounded-full bg-white px-6 py-3 font-black text-[#24335d]">Open journey map</Link>
      </div>
    </div>
  );
}
