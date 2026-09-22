"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="dc-scene flex items-center justify-center" style={{ padding: "40px 16px" }}>
      <div role="alert" className="dc-glass dc-depth-card text-center" style={{ maxWidth: 480, padding: "38px 32px", borderRadius: 28 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
          A cloud drifted off course
        </h1>
        <p style={{ fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: "10px 0 0", lineHeight: 1.6 }}>
          Something went wrong on this page. Your progress is safe. Try again, or head back to the dashboard.
        </p>
        {error.digest && (
          <p className="font-mono" style={{ fontSize: 12, color: "var(--dc-on-sky-muted)", marginTop: 10 }}>
            Reference: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 24 }}>
          <button type="button" onClick={() => unstable_retry()} className="dc-btn dc-btn--primary dc-btn--sm">
            Try again
          </button>
          <Link href="/dashboard" className="dc-btn dc-btn--secondary dc-btn--sm">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
