"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6" style={{ background: "var(--dc-page-sky)" }}>
      <div className="glass dc-depth-card max-w-lg text-center" style={{ borderRadius: 28, padding: "38px 32px" }}>
        <div className="font-display text-3xl text-white">A cloud drifted off course</div>
        <p className="mt-3 font-bold text-white/80">Your progress is safe. Try this view again, or return to the dashboard.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={unstable_retry} className="dc-pressable rounded-full bg-white px-5 py-3 font-black text-[#24335d]">Try again</button>
          <a href="/dashboard" className="dc-pressable rounded-full border-2 border-white/60 px-5 py-3 font-black text-white">Dashboard</a>
        </div>
      </div>
    </div>
  );
}
