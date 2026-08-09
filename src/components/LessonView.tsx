"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import CodeEditor from "@/components/CodeEditor";
import EditorFrame, { ConsolePanel } from "@/components/EditorFrame";
import DreamGuide from "@/components/DreamGuide";
import { usePyodide } from "@/lib/usePyodide";
import { cloudOpacity } from "@/lib/theme";
import { lessons, type Lesson, type LessonLink, type QuizQuestion } from "@/lib/curriculum";
import { practiceDatasets, getModuleChallenge } from "@/lib/data";
import { completeActivity, useUserProfile } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import { track } from "@/lib/telemetry";
import { runJavaScript } from "@/lib/javascriptRunner";

const cs = cloudOpacity.lesson;

/** Renders text with a tiny **bold** syntax. */
function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: "#13335f" }}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function LessonView({
  lesson,
  total,
  next,
}: {
  lesson: Lesson;
  total: number;
  next: LessonLink | null;
}) {
  const [code, setCode] = useState(lesson.starter);
  const [output, setOutput] = useState<string[]>([]);
  const [note, setNote] = useState<{ text: string; ok: boolean } | undefined>();
  const [running, setRunning] = useState(false);
  const py = usePyodide();

  useEffect(() => {
    track("lesson_started", {
      slug: lesson.slug,
      language: lesson.language || "python",
      module: lesson.module || lesson.chapter || "Basics",
      tier: lesson.tier || "beginner",
    });
  }, [lesson.slug, lesson.language, lesson.module, lesson.chapter, lesson.tier]);

  // Read + quiz lessons (e.g. C#) have no client-side runtime: no editor/Run.
  const runnable = lesson.runnable !== false;

  // Section challenge: a difficulty-matched capstone surfaced as a CTA on a
  // module's last lesson (mirrors the /journey "Section challenge" node). Only
  // runnable modules with a mapped challenge get one.
  const moduleName = lesson.module || lesson.chapter || "Basics";
  const moduleLessons = lessons
    .filter(
      (l) =>
        (l.language || "python") === (lesson.language || "python") &&
        (l.module || l.chapter || "Basics") === moduleName,
    )
    .sort((a, b) => a.order - b.order);
  const isLastOfModule = moduleLessons[moduleLessons.length - 1]?.slug === lesson.slug;
  const sectionChallenge = runnable && isLastOfModule ? getModuleChallenge(moduleName) : null;

  // Flow gating: a learner must PASS the practice before moving on. While the
  // lesson has an unfinished practice, the only forward CTA is "Practice this",
  // and the lesson is only marked learned once practice is completed (the practice
  // page records both `practice:<slug>` and the lesson slug).
  const { profile } = useUserProfile();
  const completedStops = profile.completedStops || [];
  const hasPractice = !!(lesson.practiceSlug && practiceDatasets[lesson.practiceSlug]);
  const practiceDone = !hasPractice || completedStops.includes(`practice:${lesson.practiceSlug}`);
  const lessonLearned = completedStops.includes(lesson.slug);

  const [quizDone, setQuizDone] = useState(false);
  const completeFromQuiz = () => {
    if (quizDone) return;
    setQuizDone(true);
    completeActivity(lesson.slug);
    track("lesson_completed", {
      slug: lesson.slug,
      language: lesson.language || "python",
      module: lesson.module || lesson.chapter || "Basics",
    });
    playChime("success");
  };

  // Runs a string of JavaScript in-browser, capturing console.log. Used directly
  // for the JS track and for the transpiled output of the TypeScript track.
  const executeJs = async (jsCode: string, lang: string) => {
    const result = await runJavaScript(jsCode);
    setOutput(result.logs);
    setNote({
      text: result.ok
        ? result.logs.length ? "Done." : "Finished, with no output to show."
        : result.error || "Execution failed.",
      ok: result.ok,
    });
    track("code_run", { slug: lesson.slug, language: lang, ok: result.ok });
    setRunning(false);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setOutput([]);

    if (lesson.language === "javascript") {
      setNote({ text: "Running...", ok: true });
      await executeJs(code, "javascript");
      return;
    }

    if (lesson.language === "typescript") {
      setNote({ text: "Compiling TypeScript...", ok: true });
      let js: string;
      try {
        const res = await fetch("/api/transpile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        if (!res.ok) throw new Error("Could not reach the TypeScript compiler.");
        const data = await res.json();
        if (Array.isArray(data.diagnostics) && data.diagnostics.length > 0) {
          setOutput([]);
          setNote({ text: data.diagnostics[0], ok: false });
          track("code_run", { slug: lesson.slug, language: "typescript", ok: false });
          setRunning(false);
          return;
        }
        js = data.js || "";
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setNote({ text: msg, ok: false });
        setRunning(false);
        return;
      }
      setNote({ text: "Running...", ok: true });
      await executeJs(js, "typescript");
      return;
    }

    setNote({
      text: py.status === "ready" ? "Running..." : "Booting Python (first run only)...",
      ok: true,
    });

    const res = await py.run(code);

    setOutput(res.stdout);
    if (res.ok) {
      setNote({ text: res.stdout.length ? "Done." : "Finished, with no output to show.", ok: true });
      track("code_run", { slug: lesson.slug, language: lesson.language || "python", ok: true });
    } else {
      const summary =
        (res.error || "").trim().split("\n").filter(Boolean).pop() || "Something went wrong.";
      setNote({ text: summary, ok: false });
      track("code_run", { slug: lesson.slug, language: lesson.language || "python", ok: false });
    }
    setRunning(false);
  };

  const runLabel = running
    ? lesson.language === "javascript" || lesson.language === "typescript"
      ? "Running..."
      : py.status === "ready"
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

      {/* lesson top bar - sits just under the global nav */}
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
          {"\u2190"} Back to map
        </Link>
        <div className="flex items-center" style={{ gap: 12, minWidth: 0 }}>
          <div
            className="font-display"
            style={{ fontWeight: 700, fontSize: 16, color: "#ffffff", whiteSpace: "nowrap" }}
          >
            {lesson.catalogTitle} {"\u00b7"} Lesson {lesson.order} of {total}
          </div>
          {/* Compact progress bar. Scales to any lesson count, so it never blows
              out the bar on phones the way one dot per lesson did. */}
          <div
            aria-hidden="true"
            style={{
              position: "relative",
              width: "clamp(64px, 18vw, 150px)",
              height: 6,
              borderRadius: 999,
              background: "rgba(255,255,255,.22)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: `${Math.round((lesson.order / Math.max(total, 1)) * 100)}%`,
                background: "linear-gradient(90deg, #ff7ad9, #c8b3ff)",
                boxShadow: "0 0 8px rgba(255,122,217,.7)",
              }}
            />
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
            {lesson.kicker}
          </span>
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 36, color: "#13335f", margin: "18px 0 12px" }}>
            {lesson.title}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#41608f", fontWeight: 600, margin: "0 0 22px", textWrap: "pretty" }}>
            <Emphasis text={lesson.intro} />
          </p>

          {/* worked example, read-only with real highlighting */}
          <div
            style={{ background: "#0e2247", borderRadius: 16, padding: "10px 8px", marginBottom: 22 }}
          >
            {lesson.language === "csharp" ? (
              <pre
                className="font-mono"
                style={{ color: "#dbe9ff", fontSize: 13.5, lineHeight: 1.9, margin: 0, padding: "6px 10px", whiteSpace: "pre-wrap" }}
              >
                {lesson.example}
              </pre>
            ) : (
              <CodeEditor value={lesson.example} language={lesson.language === "javascript" ? "javascript" : lesson.language === "typescript" ? "typescript" : "python"} readOnly lineNumbers={false} minHeight="0px" />
            )}
          </div>

          <div className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#13335f", marginBottom: 12 }}>
            How it reads
          </div>
          <div className="flex flex-col" style={{ gap: 12, marginBottom: 24 }}>
            {lesson.reads.map((row, i) => (
              <div key={i} className="flex items-start" style={{ gap: 12 }}>
                <span style={{ flexShrink: 0, width: 10, height: 10, borderRadius: "50%", background: row.dot, marginTop: 6 }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: "#41608f", lineHeight: 1.6 }}>
                  <Emphasis text={row.text} />
                </span>
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
              <strong>Cloud tip:</strong> <Emphasis text={lesson.tip} />
            </div>
          </div>
        </div>

        {/* right: editor */}
        <div className="flex flex-col lg:sticky" style={{ gap: 18, top: "calc(var(--nav-h) + 64px)" }}>
          {runnable ? (
          <>
          <EditorFrame
            filename={lesson.language === "javascript" ? "index.js" : lesson.language === "typescript" ? "index.ts" : "main.py"}
            language={lesson.language === "javascript" ? "JAVASCRIPT" : lesson.language === "typescript" ? "TYPESCRIPT" : "PYTHON"}
            footer={
              <div className="flex items-center justify-between" style={{ padding: "0 18px 16px", gap: 12 }}>
                <span
                  className="font-mono"
                  style={{ fontSize: 11, fontWeight: 600, color: "#9db8e8", letterSpacing: 0.3 }}
                >
                  {lesson.language === "javascript"
                    ? "real JavaScript, runs in your browser"
                    : lesson.language === "typescript"
                      ? "real TypeScript, compiled then run in your browser"
                      : py.status === "error"
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
              <CodeEditor value={code} onChange={setCode} language={lesson.language === "javascript" ? "javascript" : lesson.language === "typescript" ? "typescript" : "python"} minHeight="180px" />
            </div>
          </EditorFrame>

          <ConsolePanel lines={output} note={note} />
          </>
          ) : (
            <QuizPanel quiz={lesson.quiz ?? []} onPass={completeFromQuiz} done={quizDone} />
          )}

          <div className="flex flex-wrap items-center justify-end" style={{ gap: 12 }}>
            {runnable && hasPractice && !practiceDone ? (
              // Practice is required before moving on, so it is the ONLY forward
              // action here. The Next button appears once practice is passed (the
              // practice page marks both the practice and the lesson complete).
              <Link
                href={`/practice/${lesson.practiceSlug}`}
                className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 16,
                  padding: "12px 28px",
                  borderRadius: 999,
                  boxShadow: "0 0 24px rgba(255,100,200,.55), 0 14px 30px rgba(20,10,50,.45)",
                }}
              >
                Practice this {"\u2192"}
              </Link>
            ) : (
              <>
                {sectionChallenge && !completedStops.includes(sectionChallenge.slug) && (
                  <Link
                    href={`/challenge/${sectionChallenge.slug}`}
                    className="font-display cursor-pointer backdrop-blur-sm transition-colors hover:bg-[rgba(255,200,90,.22)]"
                    style={{
                      background: "rgba(60,44,20,.4)",
                      border: "2px solid rgba(255,216,120,.9)",
                      color: "#fff6df",
                      fontWeight: 700,
                      fontSize: 16,
                      padding: "12px 24px",
                      borderRadius: 999,
                    }}
                  >
                    {"\u2605"} Section challenge {"\u2192"}
                  </Link>
                )}
                <Link
                  href={next ? `/lesson/${next.slug}` : "/journey"}
                  onClick={() => {
                    if (runnable && !lessonLearned) {
                      completeActivity(lesson.slug);
                      track("lesson_completed", {
                        slug: lesson.slug,
                        language: lesson.language || "python",
                        module: lesson.module || lesson.chapter || "Basics",
                      });
                    }
                  }}
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
                  {next ? `Next: ${next.title} \u2192` : "Finish chapter \u2192"}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <DreamGuide
        context={{
          title: lesson.title,
          instructions: lesson.intro,
          language: lesson.language,
          kind: "lesson",
        }}
        getCode={() => code}
      />
    </div>
  );
}

/**
 * Read + quiz assessment for lessons without a client-side runtime (e.g. C#).
 * Replaces the editor: the learner answers multiple-choice questions, and when
 * all are correct the lesson is completed (XP awarded once via `onPass`).
 */
function QuizPanel({
  quiz,
  onPass,
  done,
}: {
  quiz: QuizQuestion[];
  onPass: () => void;
  done: boolean;
}) {
  const [picked, setPicked] = useState<(number | null)[]>(() => quiz.map(() => null));

  if (quiz.length === 0) {
    return (
      <div className="glass-strong" style={{ borderRadius: 20, padding: "24px 26px", color: "#41608f", fontWeight: 600 }}>
        This lesson is a read-through. Review the example, then continue.
      </div>
    );
  }

  const allCorrect = quiz.every((q, i) => picked[i] === q.answer);

  const choose = (qi: number, oi: number) => {
    const next = picked.map((p, i) => (i === qi ? oi : p));
    setPicked(next);
    if (quiz.every((q, i) => next[i] === q.answer)) onPass();
  };

  return (
    <div
      className="glass-strong"
      style={{ borderRadius: 20, boxShadow: "0 20px 44px rgba(60,80,150,.22)", padding: "24px 26px" }}
    >
      <div className="font-display" style={{ fontWeight: 800, fontSize: 18, color: "#13335f", marginBottom: 4 }}>
        Check your understanding
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#7b93b8", marginBottom: 18 }}>
        Answer all {quiz.length} to complete this lesson {"·"} +15 XP
      </div>

      <div className="flex flex-col" style={{ gap: 22 }}>
        {quiz.map((q, qi) => {
          const sel = picked[qi];
          const answered = sel !== null;
          const correct = answered && sel === q.answer;
          return (
            <div key={qi}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#13335f", marginBottom: 10, lineHeight: 1.5 }}>
                {qi + 1}. {q.prompt}
              </div>
              <div className="flex flex-col" style={{ gap: 8 }}>
                {q.options.map((opt, oi) => {
                  const isSel = sel === oi;
                  const isAnswer = oi === q.answer;
                  let bg = "#f3f7fc";
                  let border = "#e2ecf7";
                  let color = "#2c4a7c";
                  if (isSel && isAnswer) {
                    bg = "#effaf3";
                    border = "#7fd6a4";
                    color = "#0f5c38";
                  } else if (isSel && !isAnswer) {
                    bg = "#fdeff3";
                    border = "#ffa8c2";
                    color = "#a13163";
                  } else if (answered && isAnswer) {
                    bg = "#f0faf4";
                    border = "#bfe6cf";
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      disabled={correct}
                      className="text-left transition-colors"
                      style={{
                        background: bg,
                        border: `2px solid ${border}`,
                        borderRadius: 12,
                        padding: "11px 14px",
                        fontSize: 14,
                        fontWeight: 700,
                        color,
                        cursor: correct ? "default" : "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && q.explain && (
                <div style={{ fontSize: 13, fontWeight: 600, color: correct ? "#0f8a52" : "#a13163", marginTop: 8, lineHeight: 1.5 }}>
                  {correct ? "✓ " : "✗ "}
                  {q.explain}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(allCorrect || done) && (
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 13.5,
            fontWeight: 800,
            color: "#0f5c38",
            background: "rgba(169,236,201,.25)",
            border: "1px solid rgba(127,214,164,.5)",
            borderRadius: 12,
            padding: "12px 14px",
          }}
        >
          Lesson complete - you can move on. {"✓"}
        </div>
      )}
    </div>
  );
}

