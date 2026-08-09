"use client";

export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#090d26", color: "white", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div>
            <h1>dreamcode needs a fresh launch</h1>
            <p>The page hit an unexpected problem. Your saved progress has not been removed.</p>
            <button onClick={unstable_retry} style={{ marginTop: 16, border: 0, borderRadius: 999, padding: "12px 22px", fontWeight: 800, cursor: "pointer" }}>Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
