"use client";

import { useState, use, useRef, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cloud from "@/components/Cloud";
import CodeEditor from "@/components/CodeEditor";
import EditorFrame from "@/components/EditorFrame";
import DreamGuide from "@/components/DreamGuide";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";
import { completeActivity, recordSubmission } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import { projects } from "@/lib/data";
import { usePyodide } from "@/lib/usePyodide";
import { track } from "@/lib/telemetry";
import { testJavaScript } from "@/lib/javascriptRunner";

type TestState = "idle" | "pass" | "fail";

const cs = cloudOpacity.challenge;

export default function DynamicProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = projects.find((p) => p.id === slug);
  if (!project || !project.instructions || !project.starter || !project.functionName || !project.testCases) {
    notFound();
  }

  const [code, setCode] = useState(project.starter);
  const [results, setResults] = useState<TestState[]>(() =>
    project.testCases!.map(() => "idle")
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

    // Auto-focus first element
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

    if (project.language === "JavaScript") {
      try {
        const execution = await testJavaScript(code, project.functionName!, project.testCases!);
        if (!execution.ok) throw new Error(execution.error || "Execution failed.");
        const next = (execution.passes || []).map((passed) => passed ? "pass" : "fail") as TestState[];

        setResults(next);
        const allPassed = next.every((r) => r === "pass");
        recordSubmission(project.id, code, allPassed);
        if (allPassed) {
          track("project_completed", { slug: project.id });
          setWon(true);
          completeActivity(project.id);
          playChime("success");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setResults(project.testCases!.map(() => "fail"));
      } finally {
        setRunning(false);
      }
    } else {
      // Python project execution using Pyodide
      try {
        // Construct a grading script
        const runCode = `${code}
import json
test_cases = ${JSON.stringify(project.testCases!.map(t => t.args))}
results = []
for args in test_cases:
    try:
        res = ${project.functionName}(*args)
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
            const next = project.testCases!.map((t, idx) => {
              const output = outputs[idx];
              return JSON.stringify(output) === JSON.stringify(t.expected) ? "pass" : "fail";
            }) as TestState[];

            setResults(next);
            const allPassed = next.every((r) => r === "pass");
            recordSubmission(project.id, code, allPassed);
            if (allPassed) {
              track("project_completed", { slug: project.id });
              setWon(true);
              completeActivity(project.id);
              playChime("success");
            }
          } else {
            throw new Error("No test output received from Python runner.");
          }
        } else {
          throw new Error(res.error || "Execution failed.");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setResults(project.testCases!.map(() => "fail"));
      } finally {
        setRunning(false);
      }
    }
  };

  const passing = results.filter((r) => r === "pass").length;

  return (
    <div className="relative" style={{ minHeight: "100vh", background: "#30235c" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/backgrounds/bg-hero-cloudsea-sunset.webp"
        alt=""
        className="fixed inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 60%", opacity: 0.25 }}
      />

      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" fixed pos={{ right: "4%", top: "12%" }} width="min(350px, 28vw)" opacity={0.7} duration={14} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-10.webp" fixed pos={{ left: "-4%", bottom: "8%" }} width="min(420px, 32vw)" opacity={0.65} duration={16} scale={cs} />

      <div
        className="pointer-events-none fixed inset-0 z-2"
        style={{ background: "linear-gradient(180deg, #1b2045 0%, #402657 100%)", opacity: gradientOpacity.challenge }}
      />

      {/* project top bar */}
      <div
        className="sticky z-20 flex flex-wrap items-center justify-between backdrop-blur-xl"
        style={{
          top: "var(--nav-h)",
          gap: 12,
          padding: "12px clamp(16px, 4vw, 32px)",
          background: "rgba(20,16,48,.8)",
          borderBottom: "1px solid rgba(255,255,255,.12)",
        }}
      >
        <Link
          href="/projects"
          className="cursor-pointer transition-colors hover:border-[#ff7ad9]"
          style={{
            background: "rgba(255,255,255,.05)",
            border: "2px solid rgba(255,255,255,.15)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 13,
            padding: "8px 16px",
            borderRadius: 999,
          }}
        >
          {"\u2190"} Return to projects
        </Link>
        <div className="flex items-center" style={{ gap: 12 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#ffffff" }}>
            Project Workshop {"\u00b7"} {project.title}
          </div>
          <span style={{ background: "rgba(255,255,255,.1)", color: "#ffe7f4", fontWeight: 900, fontSize: 12, padding: "5px 12px", borderRadius: 999 }}>
            {project.tier}
          </span>
          <span style={{ background: "#ffd275", color: "#6b450c", fontWeight: 900, fontSize: 12, padding: "5px 12px", borderRadius: 999 }}>
            {project.language}
          </span>
        </div>
        <div style={{ background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)", color: "#ffffff", fontWeight: 900, fontSize: 13, padding: "8px 16px", borderRadius: 999 }}>
          Reward: +{project.xp} XP
        </div>
      </div>

      <div
        className="relative z-5 mx-auto grid items-start lg:grid-cols-[360px_1fr_290px]"
        style={{ gap: 20, maxWidth: 1320, padding: "30px 28px 70px" }}
      >
        {/* instruction card */}
        <div
          className="glass-strong text-white"
          style={{ borderRadius: 20, boxShadow: "0 20px 44px rgba(0,0,0,.4)", padding: "26px 26px", border: "1px solid rgba(255,255,255,.1)" }}
        >
          <h1 className="font-display font-bold" style={{ fontSize: 24, color: "#ffffff", margin: "0 0 12px" }}>
            {project.title}
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(255,255,255,.85)", fontWeight: 600, margin: "0 0 20px", textWrap: "pretty" }}>
            {project.instructions}
          </p>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.8, color: "rgba(255,255,255,.4)", marginBottom: 8 }}>TEST SPECIFICATION</div>
          {project.testCases.slice(0, 2).map((tc, idx) => (
            <div
              key={idx}
              className="font-mono text-left"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 16px", fontSize: 12.5, lineHeight: 1.8, color: "rgba(255,255,255,.9)", marginBottom: 12 }}
            >
              <div>{project.functionName}({tc.label.split("->")[0].trim()})</div>
              <div style={{ color: "#a9ecc9" }}>
                → {JSON.stringify(tc.expected)}
              </div>
            </div>
          ))}
        </div>

        {/* code workshop frame */}
        <EditorFrame
          filename={project.language === "JavaScript" ? "project.js" : "project.py"}
          language={project.language.toUpperCase()}
          glassy
          footer={
            <div className="flex items-center justify-between" style={{ padding: "0 18px 16px" }}>
              <span className="font-mono" style={{ fontSize: 12, color: error ? "#ff8ba8" : "rgba(255,255,255,.8)" }}>
                {error ? `✗ ${error}` : running ? "Running test harness..." : "Local compilation ready"}
              </span>
              <button
                onClick={runTests}
                disabled={running}
                className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #a9ecc9, #ffd275)",
                  color: "#1c3c2b",
                  fontWeight: 900,
                  fontSize: 15,
                  padding: "10px 26px",
                  borderRadius: 999,
                  boxShadow: "0 8px 20px rgba(169,236,201,.3)",
                }}
              >
                {running ? "Running..." : "▶ Run Tests"}
              </button>
            </div>
          }
        >
          <div style={{ padding: "10px 8px 6px", minHeight: 320 }}>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={project.language.toLowerCase() as "python" | "javascript"}
              minHeight="300px"
            />
          </div>
        </EditorFrame>

        {/* verification suites */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <div
            className="glass-strong text-white"
            style={{ borderRadius: 20, boxShadow: "0 20px 44px rgba(0,0,0,.4)", padding: "22px 22px", border: "1px solid rgba(255,255,255,.1)" }}
          >
            <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#ffffff", marginBottom: 14 }}>
              Unit Tests · {passing} / {project.testCases.length} passed
            </div>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {project.testCases.map((t, i) => {
                const st = results[i];
                return (
                  <div
                    key={t.label}
                    className="flex items-center"
                    style={{
                      gap: 10,
                      background: st === "pass" ? "rgba(169,236,201,.1)" : st === "fail" ? "rgba(255,196,214,.1)" : "rgba(255,255,255,.05)",
                      borderRadius: 12,
                      padding: "10px 12px",
                      border: st === "pass" ? "1px solid rgba(169,236,201,.3)" : st === "fail" ? "1px solid rgba(255,196,214,.3)" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="flex items-center justify-center"
                      style={{
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: st === "pass" ? "#a9ecc9" : st === "fail" ? "#ffc4d6" : "rgba(255,255,255,.15)",
                        fontWeight: 900,
                        fontSize: 12,
                        color: st === "pass" ? "#0f5c38" : st === "fail" ? "#a13163" : "rgba(255,255,255,.7)",
                      }}
                    >
                      {st === "pass" ? "✓" : st === "fail" ? "✗" : "·"}
                    </span>
                    <span className="font-mono truncate" style={{ fontSize: 12, color: st === "idle" ? "rgba(255,255,255,.5)" : "#ffffff" }}>
                      {st === "idle" ? `${t.label.split("->")[0]}\u2192 run to test` : t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="text-center text-white"
            style={{
              background: "rgba(255,255,255,.06)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,.1)",
              borderRadius: 20,
              boxShadow: "0 20px 44px rgba(0,0,0,.3)",
              padding: "22px 22px",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.8, color: "#ffd275", marginBottom: 12 }}>
              PROJECT WORKSHOP
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp"
              alt={project.title}
              className="cloud-glow"
              style={{ display: "block", width: 130, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }}
            />
            <div className="font-display font-bold" style={{ fontSize: 18, color: "#ffffff", marginTop: 12 }}>
              {project.title}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.6)", marginTop: 4 }}>
              Fulfill specification to complete
            </div>
            <div
              className="inline-block"
              style={{ marginTop: 12, background: "rgba(255,255,255,.12)", color: "#ffd275", fontWeight: 900, fontSize: 13, padding: "7px 14px", borderRadius: 999 }}
            >
              +{project.xp} XP
            </div>
          </div>
        </div>
      </div>

      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(20,16,50,.75)", backdropFilter: "blur(6px)" }}>
          <div
            ref={modalRef}
            className="anim-pop-in text-center text-white"
            style={{
              background: "linear-gradient(180deg, #1b2045, #3a2254)",
              border: "1px solid rgba(255,170,230,.3)",
              borderRadius: 28,
              padding: "38px 46px",
              boxShadow: "0 0 65px rgba(255,120,220,.25), 0 30px 85px rgba(0,0,0,.8)",
              maxWidth: 380,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp"
              alt="Celebration cloud"
              className="cloud-glow"
              style={{ display: "block", width: 160, height: "auto", margin: "0 auto", animation: "floatySm 4s ease-in-out infinite" }}
            />
            <div className="font-display neon-title font-bold" style={{ fontSize: 30, color: "#ffffff", marginTop: 14 }}>
              Project Complete!
            </div>
            <p style={{ color: "rgba(255,255,255,.85)", fontWeight: 600, fontSize: 15, margin: "10px 0 4px" }}>
              Great job building {project.title}. All specification tests passed successfully!
            </p>
            <div
              className="inline-block"
              style={{ background: "#ffd275", color: "#6b450c", fontWeight: 900, fontSize: 13, padding: "7px 14px", borderRadius: 999, marginTop: 8 }}
            >
              +{project.xp} XP
            </div>
            <div className="flex justify-center" style={{ gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setWon(false)}
                className="cursor-pointer"
                style={{
                  background: "rgba(255,255,255,.08)",
                  border: "2px solid rgba(255,255,255,.25)",
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
                href="/projects"
                className="font-display cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: 15,
                  padding: "10px 24px",
                  borderRadius: 999,
                  boxShadow: "0 4px 15px rgba(255,100,200,.4)",
                }}
              >
                Back to projects {"\u2192"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <DreamGuide
        context={{
          title: project.title,
          instructions: project.instructions,
          functionName: project.functionName,
          language: project.language,
          kind: "project",
        }}
        getCode={() => code}
      />
    </div>
  );
}
