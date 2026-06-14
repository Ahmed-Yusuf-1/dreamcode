"use client";

import { useState } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import CodeEditor from "@/components/CodeEditor";
import EditorFrame, { ConsolePanel } from "@/components/EditorFrame";
import DreamGuide from "@/components/DreamGuide";
import { usePyodide } from "@/lib/usePyodide";

const STARTER = `# hop across every cloud in the sky
sky = ["cumulus", "cirrus", "stratus"]

for cloud in sky:
    print("hop →", cloud)`;

const cs = cloudOpacity.lesson;
export default function LoopsLessonPage() {
  const [code, setCode] = useState(STARTER);
  const [output, setOutput] = useState<string[]>([]);
  const [note, setNote] = useState<{ text: string; ok: boolean } | undefined>();
  const [running, setRunning] = useState(false);
  const py = usePyodide();

  const run = async () => {
    if (running) return;
    setRunning(true);
    setOutput([]);
    setNote({
      text: py.status === "ready" ? "Running..." : "Booting Python (first run only)...",
      ok: true,
    });

    const res = await py.run(code);

    setOutput(res.stdout);
    if (res.ok) {
      setNote({ text: res.stdout.length ? "Done." : "Finished, with no output to show.", ok: true });
    } else {
      // Show the most useful line of the error (the last line of the traceback).
      const summary =
        (res.error || "").trim().split("\n").filter(Boolean).pop() || "Something went wrong.";
      setNote({ text: summary, ok: false });
    }
    setRunning(false);
  };

  const runLabel = running
    ? py.status === "ready"
      ? "Running..."
      : "Booting Python..."
    : "▶ Run";

  return (
    <div
      className="relative"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a1c52 0%, #2b2c63 26%, #4c4096 62%, #8E95CE 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-14.webp" speed={0.08} pos={{ right: "-3%", top: "2%" }} width="min(420px, 32vw)" opacity={0.8} duration={16} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-16.webp" speed={0.05} pos={{ left: "-4%", bottom: "4%" }} width="min(380px, 28vw)" opacity={0.75} duration={18} delay={2} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp" speed={0.14} pos={{ left: "8%", top: "12%" }} width="min(260px, 22vw)" opacity={0.7} anim="floatySm" duration={9} delay={0.7} neon="cyan" scale={cs} />

      {/* lesson top bar */}
      <div
        className="sticky z-20 flex flex-wrap items-center justify-between backdrop-blur-lg"
        style={{
          top: "var(--nav-h)",
          gap: 12,
          padding: "12px clamp(16px, 4vw, 32px)",
          background: "rgba(24,20,70,.55)",
          borderBottom: "1px solid rgba(255,255,255,.18)",
        }}
      >
        <Link
          href="/journey"
          className="cursor-pointer transition-colors hover:bg-white/30"
          style={{
            background: "rgba(255,255,255,.16)",
            border: "1px solid rgba(255,255,255,.45)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 999,
          }}
        >
          ← Back to map
        </Link>
        <div className="flex items-center" style={{ gap: 14 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#ffffff" }}>
            Loops · Lesson 3 of 5
          </div>
          <div className="flex" style={{ gap: 6 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: n <= 3 ? "#ff7ad9" : "rgba(255,255,255,.3)",
                  boxShadow: n <= 3 ? "0 0 8px rgba(255,122,217,.8)" : undefined,
                }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            background: "#fff3c9",
            color: "#7a5410",
            fontWeight: 900,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 999,
          }}
        >
          +15 XP on finish
        </div>
      </div>

      <div
        className="relative z-5 mx-auto grid items-start lg:grid-cols-2"
        style={{ gap: 26, maxWidth: 1180, padding: "38px 32px 80px" }}
      >
        {/* left: teaching card */}
        <div
          style={{
            background: "rgba(255,255,255,.93)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,.8)",
            borderRadius: 24,
            boxShadow: "0 0 34px rgba(255,150,220,.18), 0 24px 56px rgba(10,8,40,.45)",
            padding: "36px 38px",
          }}
        >
          <span
            style={{
              background: "#d9f5e6",
              color: "#0f5c38",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: 0.8,
              padding: "6px 14px",
              borderRadius: 999,
            }}
          >
            PYTHON BASICS
          </span>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 36, color: "#13335f", margin: "18px 0 12px" }}>
            The for loop
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#41608f", fontWeight: 600, margin: "0 0 22px", textWrap: "pretty" }}>
            Sometimes you want to do the same thing many times - say hello to every cloud in the
            sky. Instead of copying a line over and over, a{" "}
            <strong style={{ color: "#13335f" }}>for loop</strong> repeats it for you, once per
            item.
          </p>

          <div
            className="font-mono"
            style={{
              background: "#0e2247",
              borderRadius: 16,
              padding: "18px 20px",
              fontSize: 14,
              lineHeight: 1.9,
              color: "#dbe9ff",
              marginBottom: 22,
            }}
          >
            <div>
              <span style={{ color: "#ff9ecf" }}>for</span> cloud <span style={{ color: "#ff9ecf" }}>in</span>{" "}
              <span style={{ color: "#9ad1ff" }}>range</span>(<span style={{ color: "#b5f1c9" }}>3</span>):
            </div>
            <div>
              {"    "}
              <span style={{ color: "#9ad1ff" }}>print</span>(<span style={{ color: "#ffe49a" }}>&quot;hop!&quot;</span>)
            </div>
          </div>

          <div className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#13335f", marginBottom: 12 }}>
            How it reads
          </div>
          <div className="flex flex-col" style={{ gap: 12, marginBottom: 24 }}>
            {[
              { dot: "#ffb6d9", html: <><strong style={{ color: "#13335f" }}>for cloud in range(3)</strong> - &quot;for each of 3 turns, call the current turn <em>cloud</em>&quot;</> },
              { dot: "#a9ecc9", html: <>The <strong style={{ color: "#13335f" }}>indented line</strong> is the part that repeats - Python knows it belongs to the loop because of the spaces</> },
              { dot: "#cdb9f7", html: <><strong style={{ color: "#13335f" }}>range(3)</strong> counts 0, 1, 2 - three numbers, starting at zero</> },
            ].map((row, i) => (
              <div key={i} className="flex items-start" style={{ gap: 12 }}>
                <span style={{ flexShrink: 0, width: 10, height: 10, borderRadius: "50%", background: row.dot, marginTop: 6 }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: "#41608f", lineHeight: 1.6 }}>{row.html}</span>
              </div>
            ))}
          </div>

          <div
            className="flex items-center"
            style={{ gap: 14, background: "#fff8e3", borderRadius: 16, padding: "16px 18px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp"
              alt=""
              style={{ display: "block", flexShrink: 0, width: 54, height: "auto" }}
            />
            <div style={{ fontSize: 14, fontWeight: 700, color: "#7a5410", lineHeight: 1.6 }}>
              <strong>Cloud tip:</strong> loops start counting at 0, not 1. Nearly every programmer
              has tripped on this - now you won&apos;t.
            </div>
          </div>
        </div>

        {/* right: editor */}
        <div className="flex flex-col lg:sticky" style={{ gap: 18, top: 86 }}>
          <EditorFrame
            filename="main.py"
            language="PYTHON"
            footer={
              <div className="flex items-center justify-between" style={{ padding: "0 18px 16px", gap: 12 }}>
                <span
                  className="font-mono"
                  style={{ fontSize: 11, fontWeight: 600, color: "#9db8e8", letterSpacing: 0.3 }}
                >
                  {py.status === "error"
                    ? "could not load Python"
                    : "real Python, runs in your browser"}
                </span>
                <button
                  onClick={run}
                  disabled={running}
                  className="font-display transition-transform hover:-translate-y-0.5"
                  style={{
                    border: "none",
                    background: running ? "#7fc7a4" : "#a9ecc9",
                    color: "#0f5c38",
                    fontWeight: 800,
                    fontSize: 15,
                    padding: "10px 26px",
                    borderRadius: 999,
                    boxShadow: "0 10px 24px rgba(40,150,90,.35)",
                    cursor: running ? "wait" : "pointer",
                    opacity: running ? 0.85 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {runLabel}
                </button>
              </div>
            }
          >
            <div style={{ padding: "10px 8px 6px" }}>
              <CodeEditor value={code} onChange={setCode} language="python" minHeight="180px" />
            </div>
          </EditorFrame>

          <ConsolePanel lines={output} note={note} />

          <div className="flex justify-end" style={{ gap: 12 }}>
            <Link
              href="/practice/loops"
              className="font-display cursor-pointer backdrop-blur-sm transition-colors hover:bg-[rgba(110,230,255,.22)]"
              style={{
                background: "rgba(24,22,60,.4)",
                border: "2px solid rgba(150,245,255,.85)",
                color: "#eefcff",
                fontWeight: 700,
                fontSize: 16,
                padding: "12px 24px",
                borderRadius: 999,
                boxShadow: "0 0 16px rgba(110,230,255,.35)",
              }}
            >
              Practice this →
            </Link>
            <Link
              href="/journey"
              className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{
                border: "none",
                background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 16,
                padding: "12px 26px",
                borderRadius: 999,
                boxShadow: "0 0 24px rgba(255,100,200,.55), 0 14px 30px rgba(20,10,50,.45)",
              }}
            >
              Complete lesson · +15 XP
            </Link>
          </div>
        </div>
      </div>

      <DreamGuide />
    </div>
  );
}
