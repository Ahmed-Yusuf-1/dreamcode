"use client";

import { useState } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import CodeEditor from "@/components/CodeEditor";
import EditorFrame from "@/components/EditorFrame";
import DreamGuide from "@/components/DreamGuide";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";

const STARTER = `function countTallClouds(heights, k) {
  let count = 0;
  for (const h of heights) {
    if (h > k) {
      count = count + 1;
    }
  }
  return count;
}`;

interface TestCase {
  label: string;
  args: [number[], number];
  expected: number;
}

const TESTS: TestCase[] = [
  { label: "[3,7,2,9], k=5 → 2", args: [[3, 7, 2, 9], 5], expected: 2 },
  { label: "[], k=4 → 0", args: [[], 4], expected: 0 },
  { label: "[5,5,5], k=5 → 0", args: [[5, 5, 5], 5], expected: 0 },
];

type TestState = "idle" | "pass" | "fail";

const cs = cloudOpacity.challenge;
export default function CloudHopperPage() {
  const [code, setCode] = useState(STARTER);
  const [results, setResults] = useState<TestState[]>(["idle", "idle", "idle"]);
  const [error, setError] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const runTests = () => {
    setError(null);
    try {
      // Learner code runs in the learner's own browser - same trust domain
      // as the page. The real platform swaps this for a sandboxed worker.
      const fn = new Function(`${code}; return countTallClouds;`)();
      if (typeof fn !== "function") throw new Error("countTallClouds is not defined");
      const next = TESTS.map((t) => {
        try {
          return fn(t.args[0].slice(), t.args[1]) === t.expected ? "pass" : "fail";
        } catch {
          return "fail";
        }
      }) as TestState[];
      setResults(next);
      if (next.every((r) => r === "pass")) setWon(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResults(["fail", "fail", "fail"]);
    }
  };

  const passing = results.filter((r) => r === "pass").length;

  return (
    <div className="relative" style={{ minHeight: "100vh", background: "#8da7d6" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/backgrounds/bg-rainbow-cloud-1.webp"
        alt=""
        className="fixed inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 30%" }}
      />

      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" fixed pos={{ right: "2%", top: "8%" }} width="min(320px, 25vw)" opacity={0.85} duration={12} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-10.webp" fixed pos={{ left: "-4%", bottom: "6%" }} width="min(400px, 30vw)" opacity={0.75} duration={15} delay={1.5} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" fixed pos={{ left: "1%", top: "12%" }} width="min(260px, 20vw)" opacity={0.6} duration={14} delay={0.7} neon="magenta" scale={cs} />

      <div
        className="pointer-events-none fixed inset-0 z-2"
        style={{ background: "linear-gradient(180deg, #6E8FC7 0%, #F0AABE 100%)", opacity: gradientOpacity.challenge }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-3"
        style={{
          background:
            "linear-gradient(180deg, rgba(238,245,255,.15) 0%, rgba(238,245,255,.35) 46%, rgba(240,238,255,.55) 100%)",
        }}
      />

      {/* challenge top bar */}
      <div
        className="sticky z-20 flex flex-wrap items-center justify-between backdrop-blur-xl"
        style={{
          top: "var(--nav-h)",
          gap: 12,
          padding: "12px clamp(16px, 4vw, 32px)",
          background: "rgba(255,255,255,.72)",
          borderBottom: "1px solid rgba(255,255,255,.6)",
        }}
      >
        <Link
          href="/peaks"
          className="cursor-pointer transition-colors hover:border-[#2f6fdd]"
          style={{
            background: "#ffffff",
            border: "2px solid #d7e6f4",
            color: "#2f6fdd",
            fontWeight: 900,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 999,
          }}
        >
          ← Back to peaks
        </Link>
        <div className="flex items-center" style={{ gap: 12 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#13335f" }}>
            Problem Peaks · Cloud Hopper
          </div>
          <span style={{ background: "#d9f5e6", color: "#0f5c38", fontWeight: 900, fontSize: 12, padding: "5px 12px", borderRadius: 999 }}>
            Beginner
          </span>
          <span style={{ background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 12, padding: "5px 12px", borderRadius: 999 }}>
            JavaScript
          </span>
        </div>
        <div style={{ background: "#ffe1ef", color: "#a13163", fontWeight: 900, fontSize: 13, padding: "8px 16px", borderRadius: 999 }}>
          Reward: badge + 40 XP
        </div>
      </div>

      <div
        className="relative z-5 mx-auto grid items-start lg:grid-cols-[340px_1fr_290px]"
        style={{ gap: 20, maxWidth: 1320, padding: "30px 28px 70px" }}
      >
        {/* problem */}
        <div
          className="glass-strong"
          style={{ borderRadius: 20, boxShadow: "0 20px 44px rgba(60,80,150,.22)", padding: "26px 26px" }}
        >
          <h3 className="font-display" style={{ fontWeight: 800, fontSize: 24, color: "#13335f", margin: "0 0 12px" }}>
            Cloud Hopper
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#41608f", fontWeight: 600, margin: "0 0 18px", textWrap: "pretty" }}>
            You&apos;re hopping across the sky, but you can only land on clouds that rise{" "}
            <strong style={{ color: "#13335f" }}>above height k</strong>. Given a list of cloud
            heights, return how many clouds you can land on.
          </p>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.8, color: "#7b93b8", marginBottom: 8 }}>EXAMPLE</div>
          <div
            className="font-mono"
            style={{ background: "#f1f7fe", borderRadius: 12, padding: "14px 16px", fontSize: 13, lineHeight: 1.9, color: "#2c4a7c", marginBottom: 14 }}
          >
            <div>countTallClouds([3, 7, 2, 9], 5)</div>
            <div style={{ color: "#0f8a52" }}>
              → 2&nbsp;&nbsp;<span style={{ color: "#7b93b8" }}>{"//"} 7 and 9 are above 5</span>
            </div>
          </div>
          <div
            className="font-mono"
            style={{ background: "#f1f7fe", borderRadius: 12, padding: "14px 16px", fontSize: 13, lineHeight: 1.9, color: "#2c4a7c", marginBottom: 18 }}
          >
            <div>countTallClouds([], 4)</div>
            <div style={{ color: "#0f8a52" }}>
              → 0&nbsp;&nbsp;<span style={{ color: "#7b93b8" }}>{"//"} no clouds, no hops</span>
            </div>
          </div>
          <div className="flex items-start" style={{ gap: 10, background: "#f4effe", borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ flexShrink: 0, width: 10, height: 10, borderRadius: "50%", background: "#cdb9f7", marginTop: 5 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#5b4a8a", lineHeight: 1.6 }}>
              Hint: you just learned the perfect tool for visiting every item in a list...
            </span>
          </div>
        </div>

        {/* editor */}
        <EditorFrame
          filename="solution.js"
          language="JAVASCRIPT"
          glassy
          footer={
            <div className="flex items-center justify-between" style={{ padding: "0 18px 16px" }}>
              <span className="font-mono" style={{ fontSize: 12, color: "#48618f" }}>
                {error ? `✗ ${error}` : "Autosaved · just now"}
              </span>
              <button
                onClick={runTests}
                className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  border: "none",
                  background: "#a9ecc9",
                  color: "#0f5c38",
                  fontWeight: 800,
                  fontSize: 15,
                  padding: "10px 26px",
                  borderRadius: 999,
                  boxShadow: "0 10px 24px rgba(40,150,90,.35)",
                }}
              >
                ▶ Run tests
              </button>
            </div>
          }
        >
          <div style={{ padding: "10px 8px 6px", minHeight: 300 }}>
            <CodeEditor value={code} onChange={setCode} language="javascript" minHeight="280px" />
          </div>
        </EditorFrame>

        {/* tests + reward */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div
            className="glass-strong"
            style={{ borderRadius: 20, boxShadow: "0 20px 44px rgba(60,80,150,.22)", padding: "22px 22px" }}
          >
            <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#13335f", marginBottom: 14 }}>
              Tests · {passing} of {TESTS.length} passing
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {TESTS.map((t, i) => {
                const st = results[i];
                return (
                  <div
                    key={t.label}
                    className="flex items-center"
                    style={{
                      gap: 10,
                      background: st === "pass" ? "#effaf3" : st === "fail" ? "#fdeff3" : "#f3f7fc",
                      borderRadius: 12,
                      padding: "10px 12px",
                    }}
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: st === "pass" ? "#a9ecc9" : st === "fail" ? "#ffc4d6" : "#dbe6f2",
                        fontWeight: 900,
                        fontSize: 12,
                        color: st === "pass" ? "#0f5c38" : st === "fail" ? "#a13163" : "#7b93b8",
                      }}
                    >
                      {st === "pass" ? "✓" : st === "fail" ? "✗" : "·"}
                    </span>
                    <span className="font-mono" style={{ fontSize: 12, color: st === "idle" ? "#7b93b8" : "#2c4a7c" }}>
                      {st === "idle" ? `${t.label.split("→")[0]}→ run to check` : t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="text-center"
            style={{
              background: "rgba(255,255,255,.85)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,.8)",
              borderRadius: 20,
              boxShadow: "0 20px 44px rgba(60,80,150,.22)",
              padding: "22px 22px",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.8, color: "#c0589a", marginBottom: 12 }}>
              ON THE LINE
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-neon/cutout-cloud-neon-1-04.webp"
              alt=""
              className="cloud-glow"
              style={{ display: "block", width: 130, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }}
            />
            <div className="font-display" style={{ fontWeight: 800, fontSize: 18, color: "#13335f", marginTop: 12 }}>
              Cloud Hopper badge
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7b93b8", marginTop: 4 }}>
              Pass all 3 tests to add it to your sky
            </div>
            <div
              className="inline-block"
              style={{ marginTop: 12, background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 13, padding: "7px 14px", borderRadius: 999 }}
            >
              +40 XP
            </div>
          </div>
        </div>
      </div>

      {/* victory modal */}
      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(20,16,50,.55)", backdropFilter: "blur(6px)" }}>
          <div
            className="anim-pop-in text-center"
            style={{
              background: "linear-gradient(180deg, #2b2c63, #4c4096)",
              border: "1px solid rgba(255,170,230,.4)",
              borderRadius: 28,
              padding: "38px 46px",
              boxShadow: "0 0 60px rgba(255,100,200,.4), 0 30px 80px rgba(8,15,45,.7)",
              maxWidth: 380,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-neon/cutout-cloud-neon-1-04.webp"
              alt=""
              className="cloud-glow"
              style={{ display: "block", width: 160, height: "auto", margin: "0 auto", animation: "floatySm 4s ease-in-out infinite" }}
            />
            <div className="font-display neon-title" style={{ fontWeight: 800, fontSize: 30, color: "#fff6fb", marginTop: 14 }}>
              Badge earned!
            </div>
            <p style={{ color: "rgba(255,255,255,.92)", fontWeight: 700, fontSize: 15, margin: "10px 0 4px" }}>
              Cloud Hopper joins your sky - every test passed.
            </p>
            <div
              className="inline-block"
              style={{ background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 13, padding: "7px 14px", borderRadius: 999, marginTop: 8 }}
            >
              +40 XP
            </div>
            <div className="flex justify-center" style={{ gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setWon(false)}
                className="cursor-pointer"
                style={{
                  background: "rgba(255,255,255,.14)",
                  border: "2px solid rgba(255,255,255,.5)",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "10px 20px",
                  borderRadius: 999,
                }}
              >
                Stay here
              </button>
              <Link
                href="/badges"
                className="font-display cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 15,
                  padding: "10px 24px",
                  borderRadius: 999,
                  boxShadow: "0 0 24px rgba(255,100,200,.6)",
                }}
              >
                See your collection →
              </Link>
            </div>
          </div>
        </div>
      )}

      <DreamGuide />
    </div>
  );
}
