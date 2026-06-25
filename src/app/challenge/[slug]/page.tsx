"use client";

import { useState, use, useRef, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cloud from "@/components/Cloud";
import CodeEditor from "@/components/CodeEditor";
import EditorFrame from "@/components/EditorFrame";
import DreamGuide from "@/components/DreamGuide";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";
import { addXP, unlockBadge, completeStop, recordSubmission } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import { challenges } from "@/lib/data";
import { usePyodide } from "@/lib/usePyodide";
import { track } from "@/lib/telemetry";

type TestState = "idle" | "pass" | "fail";

const cs = cloudOpacity.challenge;

export default function DynamicChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const challenge = challenges[slug];
  if (!challenge) notFound();

  const [code, setCode] = useState(challenge.starter);

  useEffect(() => {
    track("challenge_started", {
      slug: challenge.slug,
      level: challenge.level,
      language: challenge.language,
    });
  }, [challenge.slug, challenge.level, challenge.language]);
  const [results, setResults] = useState<TestState[]>(() =>
    challenge.testCases.map(() => "idle")
  );
  const [error, setError] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [running, setRunning] = useState(false);
  const py = usePyodide();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!won) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setWon(false);
        e.preventDefault();
        return;
      }
      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Auto-focus the first element in modal
    setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 50);

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [won]);

  const runTests = async () => {
    setError(null);
    setRunning(true);

    if (challenge.language === "JavaScript" || challenge.language === "TypeScript") {
      try {
        let runnableCode = code;
        if (challenge.language === "TypeScript") {
          const tr = await fetch("/api/transpile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });
          if (!tr.ok) throw new Error("Could not reach the TypeScript compiler.");
          const tdata = await tr.json();
          if (Array.isArray(tdata.diagnostics) && tdata.diagnostics.length > 0) {
            throw new Error(tdata.diagnostics[0]);
          }
          runnableCode = tdata.js || "";
        }
        const fn = new Function(`${runnableCode}; return ${challenge.functionName};`)();
        if (typeof fn !== "function") throw new Error(`${challenge.functionName} is not defined`);

        const next = challenge.testCases.map((t) => {
          try {
            const res = fn(...t.args);
            return JSON.stringify(res) === JSON.stringify(t.expected) ? "pass" : "fail";
          } catch {
            return "fail";
          }
        }) as TestState[];

        setResults(next);
        const allPassed = next.every((r) => r === "pass");
        recordSubmission(challenge.slug, code, allPassed);
        if (allPassed) {
          track("challenge_passed", {
            slug: challenge.slug,
            level: challenge.level,
            language: challenge.language,
          });
          setWon(true);
          addXP(challenge.xp);
          if (challenge.badge) unlockBadge(challenge.badge);
          completeStop(challenge.slug);
          playChime("badge");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setResults(challenge.testCases.map(() => "fail"));
      } finally {
        setRunning(false);
      }
    } else {
      // Python challenge execution using Pyodide
      try {
        // Construct a grading script
        const runCode = `${code}
import json
test_cases = ${JSON.stringify(challenge.testCases.map(t => t.args))}
results = []
for args in test_cases:
    try:
        res = ${challenge.functionName}(*args)
        results.append(res)
    except Exception as e:
        results.append(None)
print("TEST_OUTPUTS:" + json.dumps(results))
`;
        const res = await py.run(runCode);

        if (res.ok) {
          const outLine = res.stdout.find((l) => l.startsWith("TEST_OUTPUTS:"));
          if (outLine) {
            const outputs = JSON.parse(outLine.substring("TEST_OUTPUTS:".length));
            const next = challenge.testCases.map((t, idx) => {
              const output = outputs[idx];
              return JSON.stringify(output) === JSON.stringify(t.expected) ? "pass" : "fail";
            }) as TestState[];

            setResults(next);
            const allPassed = next.every((r) => r === "pass");
            recordSubmission(challenge.slug, code, allPassed);
            if (allPassed) {
              track("challenge_passed", {
                slug: challenge.slug,
                level: challenge.level,
                language: challenge.language,
              });
              setWon(true);
              addXP(challenge.xp);
              if (challenge.badge) unlockBadge(challenge.badge);
              completeStop(challenge.slug);
              playChime("badge");
            }
          } else {
            throw new Error("No test output received from Python runner.");
          }
        } else {
          throw new Error(res.error || "Execution failed.");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setResults(challenge.testCases.map(() => "fail"));
      } finally {
        setRunning(false);
      }
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
        style={{ background: "linear-gradient(180deg, #355a9e 0%, #6E8FC7 36%, #b9a3cf 70%, #F0AABE 100%)", opacity: gradientOpacity.challenge }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-3"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,16,56,.32) 0%, rgba(28,16,56,.05) 42%, rgba(28,16,56,.20) 100%)",
        }}
      />

      {/* challenge top bar */}
      <div
        className="sticky z-20 flex flex-wrap items-center justify-between backdrop-blur-xl"
        style={{
          top: "var(--nav-h)",
          gap: 12,
          padding: "12px clamp(16px, 4vw, 32px)",
          background: "rgba(24,20,70,.55)",
          borderBottom: "1px solid rgba(255,255,255,.18)",
        }}
      >
        <Link
          href="/peaks"
          className="cursor-pointer transition-colors hover:bg-white/30"
          style={{
            background: "rgba(255,255,255,.16)",
            border: "2px solid rgba(255,255,255,.45)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 999,
          }}
        >
          {"\u2190"} Back to peaks
        </Link>
        <div className="flex items-center" style={{ gap: 12 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#ffffff" }}>
            Problem Peaks {"\u00b7"} {challenge.name}
          </div>
          <span style={{ background: "#d9f5e6", color: "#0f5c38", fontWeight: 900, fontSize: 12, padding: "5px 12px", borderRadius: 999 }}>
            {challenge.level}
          </span>
          <span style={{ background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 12, padding: "5px 12px", borderRadius: 999 }}>
            {challenge.language}
          </span>
        </div>
        <div style={{ background: "#ffe1ef", color: "#a13163", fontWeight: 900, fontSize: 13, padding: "8px 16px", borderRadius: 999 }}>
          Reward: {challenge.badge ? "badge + " : ""}{challenge.xp} XP
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
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 24, color: "#13335f", margin: "0 0 12px" }}>
            {challenge.name}
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#41608f", fontWeight: 600, margin: "0 0 18px", textWrap: "pretty" }}>
            {challenge.instructions}
          </p>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.8, color: "#7b93b8", marginBottom: 8 }}>EXAMPLES</div>
          {challenge.testCases.slice(0, 2).map((tc, idx) => (
            <div
              key={idx}
              className="font-mono"
              style={{ background: "#f1f7fe", borderRadius: 12, padding: "14px 16px", fontSize: 13, lineHeight: 1.9, color: "#2c4a7c", marginBottom: 12 }}
            >
              <div>{challenge.functionName}({tc.label.split("\u2192")[0].trim()})</div>
              <div style={{ color: "#0f8a52" }}>
                → {JSON.stringify(tc.expected)}
              </div>
            </div>
          ))}
        </div>

        {/* editor */}
        <EditorFrame
          filename={challenge.language === "Python" ? "solution.py" : challenge.language === "TypeScript" ? "solution.ts" : "solution.js"}
          language={challenge.language.toUpperCase()}
          glassy
          footer={
            <div className="flex items-center justify-between" style={{ padding: "0 18px 16px" }}>
              <span className="font-mono" style={{ fontSize: 12, color: "#48618f" }}>
                {error ? `✗ ${error}` : running ? "Running..." : "Autosaved · just now"}
              </span>
              <button
                onClick={runTests}
                disabled={running}
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
                {running ? "Running..." : "▶ Run tests"}
              </button>
            </div>
          }
        >
          <div style={{ padding: "10px 8px 6px", minHeight: 300 }}>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={challenge.language.toLowerCase() as "python" | "javascript" | "typescript"}
              minHeight="280px"
            />
          </div>
        </EditorFrame>

        {/* tests + reward */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div
            className="glass-strong"
            style={{ borderRadius: 20, boxShadow: "0 20px 44px rgba(60,80,150,.22)", padding: "22px 22px" }}
          >
            <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#13335f", marginBottom: 14 }}>
              Tests · {passing} of {challenge.testCases.length} passing
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {challenge.testCases.map((t, i) => {
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
                      {st === "idle" ? `${t.label.split("\u2192")[0]}\u2192 run to check` : t.label}
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
              alt={challenge.badge ? `${challenge.name} badge` : "Concept Mastery"}
              className="cloud-glow"
              style={{ display: "block", width: 130, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }}
            />
            <div className="font-display" style={{ fontWeight: 800, fontSize: 18, color: "#13335f", marginTop: 12 }}>
              {challenge.badge ? `${challenge.name} badge` : "Concept Mastery"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7b93b8", marginTop: 4 }}>
              Pass all {challenge.testCases.length} tests to claim it
            </div>
            <div
              className="inline-block"
              style={{ marginTop: 12, background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 13, padding: "7px 14px", borderRadius: 999 }}
            >
              +{challenge.xp} XP
            </div>
          </div>
        </div>
      </div>

      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(20,16,50,.55)", backdropFilter: "blur(6px)" }}>
          <div
            ref={modalRef}
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
              alt="Celebration cloud"
              className="cloud-glow"
              style={{ display: "block", width: 160, height: "auto", margin: "0 auto", animation: "floatySm 4s ease-in-out infinite" }}
            />
            <div className="font-display neon-title" style={{ fontWeight: 800, fontSize: 30, color: "#fff6fb", marginTop: 14 }}>
              {challenge.badge ? "Badge earned!" : "Challenge Solved!"}
            </div>
            <p style={{ color: "rgba(255,255,255,.92)", fontWeight: 700, fontSize: 15, margin: "10px 0 4px" }}>
              {challenge.badge ? `${challenge.name} joins your sky - every test passed.` : `You completed ${challenge.name} successfully.`}
            </p>
            <div
              className="inline-block"
              style={{ background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 13, padding: "7px 14px", borderRadius: 999, marginTop: 8 }}
            >
              +{challenge.xp} XP
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
                href="/peaks"
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
                Back to peaks {"\u2192"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <DreamGuide
        context={{
          title: challenge.name,
          instructions: challenge.instructions,
          functionName: challenge.functionName,
          language: challenge.language,
          kind: "challenge",
        }}
        getCode={() => code}
      />
    </div>
  );
}
