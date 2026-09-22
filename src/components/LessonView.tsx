"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import CodeEditor, { type EditorLanguage } from "@/components/CodeEditor";
import EditorFrame, { ConsolePanel, EditorToolButton, type ConsoleNote } from "@/components/EditorFrame";
import DreamGuide from "@/components/DreamGuide";
import DomPreview, { type DomPreviewHandle } from "@/components/DomPreview";
import RichText from "@/components/ui/RichText";
import Prose from "@/components/ui/Prose";
import FlowBar from "@/components/ui/FlowBar";
import Scene from "@/components/ui/Scene";
import { cloudOpacity } from "@/lib/theme";
import type { Lesson, LessonLink, QuizQuestion } from "@/lib/curriculum";
import { completeActivity, useUserProfile } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import { track } from "@/lib/telemetry";
import { useCodeRunner, type RunOutcome } from "@/lib/useCodeRunner";
import { useDraft } from "@/lib/useDraft";
import { checkTask } from "@/lib/lessonTask";
import { optionOrder } from "@/lib/optionOrder";
import { setActiveTrackSilently } from "@/lib/track";

export interface LessonPosition {
  index: number;
  total: number;
  chapter: number;
  moduleName: string;
}

export interface SectionChallengeLink {
  slug: string;
  name: string;
  level: string;
}

const FILENAMES: Record<EditorLanguage, string> = { python: "main.py", javascript: "index.js", typescript: "index.ts" };
const RUNTIME_LABEL: Record<EditorLanguage, string> = {
  python: "real Python, runs in your browser",
  javascript: "real JavaScript, runs in your browser",
  typescript: "type-checked, then run in your browser",
};

export default function LessonView({
  lesson,
  position,
  next,
  sectionChallenge,
  hasPractice,
}: {
  lesson: Lesson;
  position: LessonPosition;
  next: LessonLink | null;
  sectionChallenge: SectionChallengeLink | null;
  hasPractice: boolean;
}) {
  const trackId = lesson.language || "python";
  const runnable = lesson.runnable !== false;
  const language: EditorLanguage = trackId === "javascript" ? "javascript" : trackId === "typescript" ? "typescript" : "python";
  const { profile, ready } = useUserProfile();
  const completed = profile.completedStops || [];
  const lessonLearned = completed.includes(lesson.slug);
  const practiceDone = !hasPractice || completed.includes(`practice:${lesson.practiceSlug}`);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    // Opening a lesson from another track makes that track the active one, so
    // the map, dashboard and "continue" links follow the learner.
    setActiveTrackSilently(trackId);
    track("lesson_started", { slug: lesson.slug, language: trackId, module: position.moduleName, tier: lesson.tier || "beginner" });
  }, [lesson.slug, trackId, position.moduleName, lesson.tier]);

  const completeLesson = useCallback(() => {
    const result = completeActivity(lesson.slug);
    if (result.isNew) {
      track("lesson_completed", { slug: lesson.slug, language: trackId, module: position.moduleName });
    }
  }, [lesson.slug, trackId, position.moduleName]);

  const onQuizPass = () => {
    setQuizPassed(true);
    completeLesson();
    playChime("success");
  };

  const canMoveOn = runnable ? practiceDone : lessonLearned || quizPassed;
  const nextHref = next ? `/lesson/${next.slug}` : "/journey";
  const showSection = !!sectionChallenge && canMoveOn && !completed.includes(sectionChallenge.slug);

  return (
    <Scene clouds="calm" cloudScale={cloudOpacity.lesson}>
      <FlowBar
        back={{ href: "/journey", label: "Map" }}
        title={lesson.catalogTitle}
        meta={
          <>
            <span className="dc-chip dc-chip--glass">
              Lesson {position.index} of {position.total}
            </span>
            <div className="dc-progress" style={{ width: "clamp(60px, 14vw, 140px)", height: 6 }} aria-hidden="true">
              <div className="dc-progress__fill" style={{ width: `${Math.round((position.index / Math.max(position.total, 1)) * 100)}%` }} />
            </div>
          </>
        }
        right={
          lessonLearned ? (
            <span className="dc-chip dc-chip--mint">{"✓"} Learned</span>
          ) : (
            <span className="dc-chip dc-chip--butter">+15 XP on finish</span>
          )
        }
      />

      <div className="dc-container grid items-start lg:grid-cols-2" style={{ gap: 26, maxWidth: 1200, paddingTop: 30, paddingBottom: 80 }}>
        <article className="dc-paper" style={{ padding: "clamp(22px, 3.4vw, 36px)" }}>
          <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
            <span className="dc-chip dc-chip--mint">{lesson.kicker}</span>
            <span className="dc-chip dc-chip--lavender">
              Chapter {position.chapter} {"·"} {position.moduleName}
            </span>
          </div>
          <h1 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: "clamp(28px, 3.6vw, 36px)", lineHeight: 1.15, margin: "16px 0 12px" }}>
            {lesson.title}
          </h1>
          <p className="dc-prose" style={{ margin: "0 0 22px" }}>
            <RichText text={lesson.intro} />
          </p>

          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span className="dc-kicker dc-ink-muted" style={{ color: "var(--dc-ink-muted)" }}>
              Worked example
            </span>
          </div>
          <div className="dc-code" style={{ padding: "8px 6px", marginBottom: 22 }}>
            {runnable ? (
              <CodeEditor value={lesson.example} language={language} readOnly lineNumbers={false} minHeight="0px" />
            ) : (
              <pre className="font-mono" style={{ fontSize: 13.5, lineHeight: 1.85, margin: 0, padding: "8px 12px", whiteSpace: "pre-wrap", overflowX: "auto" }}>
                {lesson.example}
              </pre>
            )}
          </div>

          <h2 className="font-display dc-ink" style={{ fontWeight: 700, fontSize: 18, margin: "0 0 12px" }}>
            How it reads
          </h2>
          <ul className="flex flex-col" style={{ gap: 12, marginBottom: 24, padding: 0, listStyle: "none" }}>
            {lesson.reads.map((row, i) => (
              <li key={i} className="flex items-start" style={{ gap: 12 }}>
                <span aria-hidden="true" style={{ flexShrink: 0, width: 10, height: 10, borderRadius: "50%", background: row.dot, marginTop: 8 }} />
                <span className="dc-prose" style={{ fontSize: 15 }}>
                  <RichText text={row.text} />
                </span>
              </li>
            ))}
          </ul>

          {lesson.mistakes && lesson.mistakes.length > 0 && (
            <div className="dc-callout dc-callout--danger" style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Common mistakes</div>
              <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4, fontWeight: 700 }}>
                {lesson.mistakes.map((m, i) => (
                  <li key={i}>
                    <RichText text={m} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="dc-callout dc-callout--warn flex items-center" style={{ gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp" alt="" style={{ display: "block", flexShrink: 0, width: 50, height: "auto" }} />
            <div>
              <strong>Cloud tip:</strong> <RichText text={lesson.tip} />
            </div>
          </div>

          {lesson.deeper && lesson.deeper.length > 0 && (
            <div className="flex flex-col" style={{ gap: 10, marginTop: 20 }}>
              {lesson.deeper.map((section, i) => (
                <details key={i} className="dc-inset" style={{ padding: "12px 16px" }}>
                  <summary className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                    Go deeper: {section.title}
                  </summary>
                  <div style={{ marginTop: 10 }}>
                    <Prose text={section.body} fontSize={14.5} />
                    {section.code && (
                      <div className="dc-code" style={{ padding: "6px 4px", marginTop: 10 }}>
                        {runnable ? (
                          <CodeEditor value={section.code} language={language} readOnly lineNumbers={false} minHeight="0px" ariaLabel={`${section.title} example`} />
                        ) : (
                          <pre className="font-mono" style={{ fontSize: 13, lineHeight: 1.8, margin: 0, padding: "8px 12px", whiteSpace: "pre-wrap" }}>
                            {section.code}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </article>

        <div className="flex flex-col lg:sticky" style={{ gap: 16, top: "calc(var(--nav-h) + 70px)" }}>
          {ready && completed.length === 0 && position.index === 1 && (
            <div className="dc-callout dc-callout--info anim-fade-up">
              <strong>New here?</strong> Read the idea on the left, press Run, then change something and run it again.
              {runnable && hasPractice ? " When it clicks, practice it to unlock the next lesson." : ""}
            </div>
          )}

          {runnable ? (
            <Workbench lesson={lesson} language={language} />
          ) : (
            <QuizPanel quiz={lesson.quiz ?? []} onPass={onQuizPass} alreadyLearned={lessonLearned} />
          )}

          <div className="flex flex-wrap items-center justify-end" style={{ gap: 14, marginTop: 4 }}>
            {runnable && hasPractice && !practiceDone ? (
              <Link href={`/practice/${lesson.practiceSlug}`} className="dc-btn dc-btn--primary">
                Practice this {"→"}
              </Link>
            ) : !canMoveOn ? (
              <span style={{ color: "var(--dc-on-sky-soft)", fontWeight: 800, fontSize: 14, textShadow: "var(--dc-sky-text-shadow)" }}>
                Answer every question to unlock the next lesson.
              </span>
            ) : (
              <>
                {showSection && sectionChallenge && (
                  <Link href={`/challenge/${sectionChallenge.slug}`} className="dc-btn dc-btn--gold">
                    {"★"} Section challenge
                  </Link>
                )}
                <Link
                  href={nextHref}
                  onClick={() => {
                    if (runnable && !hasPractice && !lessonLearned) completeLesson();
                  }}
                  className="dc-btn dc-btn--primary"
                >
                  {next ? `Next: ${next.title} →` : "Back to the map →"}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <DreamGuide
        context={{ title: lesson.title, instructions: lesson.task?.prompt || lesson.intro, language: trackId, kind: "lesson" }}
        getCode={() => {
          try {
            return localStorage.getItem(`dc_draft:lesson:${lesson.slug}`) ?? lesson.starter;
          } catch {
            return lesson.starter;
          }
        }}
      />
    </Scene>
  );
}

/** Editor + Run + console + the optional "Your turn" task. */
function Workbench({ lesson, language }: { lesson: Lesson; language: EditorLanguage }) {
  const { value: code, setValue: setCode, reset, restored } = useDraft(`lesson:${lesson.slug}`, lesson.starter);
  const { run, running: workerRunning, pythonStatus } = useCodeRunner(language);
  // useCodeRunner starts a Python worker for Python lessons only; DOM lessons are JavaScript.
  const isDom = !!lesson.html;
  const previewRef = useRef<DomPreviewHandle>(null);
  const [domRunning, setDomRunning] = useState(false);
  const running = workerRunning || domRunning;
  const [lines, setLines] = useState<string[]>([]);
  const [errorLines, setErrorLines] = useState<string[]>([]);
  const [note, setNote] = useState<ConsoleNote | undefined>();
  const [errorLine, setErrorLine] = useState<number | undefined>();
  const needsInput = language === "python" && (lesson.stdin !== undefined || /\binput\s*\(/.test(code));
  const [stdin, setStdin] = useState(lesson.stdin ?? "");
  const task = lesson.task;
  const [taskState, setTaskState] = useState<{ ok: boolean; message: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const linesRef = useRef<string[]>([]);
  const lastRunOk = useRef(false);

  const evaluateTask = useCallback(
    (output: string[], isNewRun: boolean) => {
      if (!task) return;
      const result = checkTask(task, code, output);
      setTaskState((prev) => {
        if (result.ok && !prev?.ok) playChime("correct");
        return result;
      });
      if (isNewRun) setAttempts((a) => a + 1);
    },
    [task, code],
  );

  const runDom = useCallback(async (): Promise<RunOutcome> => {
    setDomRunning(true);
    try {
      let compiled: { js?: string; diagnostics?: string[] };
      try {
        const res = await fetch("/api/transpile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language: "javascript", guardLoops: true }),
        });
        if (!res.ok) throw new Error(res.status === 429 ? "Too many runs in a row. Wait a few seconds." : "Could not prepare your code.");
        compiled = await res.json();
      } catch (e) {
        return { ok: false, lines: [], errorLines: [], summary: e instanceof Error ? e.message : "Could not prepare your code." };
      }
      if (compiled.diagnostics && compiled.diagnostics.length > 0) {
        const m = compiled.diagnostics[0].match(/^Line (\d+)/);
        return { ok: false, lines: [], errorLines: compiled.diagnostics, summary: "Fix the syntax error above, then run again.", errorLine: m ? Number(m[1]) : undefined };
      }
      const result = await previewRef.current!.run(compiled.js || "");
      return {
        ok: result.ok,
        lines: result.lines,
        errorLines: result.errorLines,
        summary: result.ok ? (result.lines.length ? "Done. The page above is live." : "Done. Check the page above.") : "Your code stopped with an error.",
      };
    } finally {
      setDomRunning(false);
    }
  }, [code]);

  const doRun = useCallback(async () => {
    if (running) return;
    setNote({ text: language === "python" && pythonStatus !== "ready" ? "Starting Python (first run only)..." : language === "typescript" ? "Checking types..." : "Running...", ok: true });
    setLines([]);
    setErrorLines([]);
    setErrorLine(undefined);
    const outcome = isDom
      ? await runDom()
      : await run(code, needsInput ? stdin : undefined, {
          packages: lesson.packages,
          onPackages: (names) => setNote({ text: `Downloading ${names.join(" and ")} (first run only)...`, ok: true }),
        });
    linesRef.current = outcome.lines;
    lastRunOk.current = outcome.ok;
    setLines(outcome.lines);
    setErrorLines(outcome.errorLines);
    setErrorLine(outcome.errorLine);
    setNote({ text: outcome.summary, ok: outcome.ok });
    track("code_run", { slug: lesson.slug, language, ok: outcome.ok });
    if (task) {
      if (!outcome.ok) {
        setTaskState(null);
        return;
      }
      evaluateTask(outcome.lines, true);
    }
  }, [running, language, pythonStatus, isDom, runDom, run, code, needsInput, stdin, lesson.slug, lesson.packages, task, evaluateTask]);

  // Clicks and timers in the preview keep producing output after the run.
  const onLateOutput = useCallback(
    (more: string[], errors: string[]) => {
      if (more.length) {
        linesRef.current = [...linesRef.current, ...more];
        setLines(linesRef.current);
        if (lastRunOk.current) evaluateTask(linesRef.current, false);
      }
      if (errors.length) setErrorLines((prev) => [...prev, ...errors]);
    },
    [evaluateTask],
  );

  const changed = code !== lesson.starter;

  return (
    <>
      <EditorFrame
        filename={FILENAMES[language]}
        language={language.toUpperCase()}
        toolbar={
          changed ? (
            <EditorToolButton
              onClick={() => {
                reset();
                setErrorLine(undefined);
              }}
              label="Reset the editor to the starter code"
            >
              Reset
            </EditorToolButton>
          ) : null
        }
        footer={
          <div className="flex flex-wrap items-center justify-between" style={{ padding: "4px 16px 14px", gap: 10 }}>
            <span className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: "#9db8e8", letterSpacing: 0.3 }}>
              {language === "python" && pythonStatus === "error"
                ? "Python could not load. Check your connection."
                : isDom
                  ? "real JavaScript, runs in the live page below"
                  : RUNTIME_LABEL[language]}
              {restored ? " · your draft was restored" : ""}
            </span>
            <button type="button" onClick={doRun} disabled={running} className="dc-btn dc-btn--run dc-btn--sm" style={{ fontSize: 14, padding: "9px 22px" }} title="Run (Ctrl or Cmd + Enter)">
              {running ? "Running..." : "▶ Run"}
            </button>
          </div>
        }
      >
        <div style={{ padding: "8px 6px 4px" }}>
          <CodeEditor value={code} onChange={setCode} language={language} minHeight="190px" onRun={doRun} errorLine={errorLine} ariaLabel={`${lesson.title} code editor`} />
        </div>
      </EditorFrame>

      {isDom && lesson.html && <DomPreview ref={previewRef} html={lesson.html} onLateOutput={onLateOutput} />}

      {needsInput && (
        <label className="block">
          <span className="dc-kicker" style={{ display: "block", marginBottom: 6 }}>
            Input {"·"} one line per input() call
          </span>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={Math.min(5, Math.max(2, stdin.split("\n").length))}
            className="font-mono"
            spellCheck={false}
            style={{
              width: "100%",
              background: "var(--dc-console-bg)",
              color: "#ffe49a",
              border: "1px solid rgba(255,255,255,.14)",
              borderRadius: 14,
              padding: "10px 14px",
              fontSize: 13,
              lineHeight: 1.7,
              outline: "none",
              resize: "vertical",
            }}
          />
        </label>
      )}

      <ConsolePanel lines={lines} errorLines={errorLines} note={note} />

      {task && (
        <section className="dc-paper" style={{ padding: "18px 20px", borderRadius: 20 }} aria-live="polite">
          <div className="flex items-center justify-between" style={{ gap: 10, marginBottom: 8 }}>
            <span className="dc-chip dc-chip--pink">YOUR TURN</span>
            {taskState?.ok && <span className="dc-chip dc-chip--mint">{"✓"} Done</span>}
          </div>
          <p className="dc-prose" style={{ fontSize: 15, margin: 0 }}>
            <RichText text={task.prompt} />
          </p>
          {taskState && !taskState.ok && (
            <div className="dc-callout dc-callout--danger" style={{ marginTop: 12, padding: "10px 14px", fontSize: 13.5 }}>
              {taskState.message}
            </div>
          )}
          {taskState?.ok && (
            <div className="dc-callout dc-callout--success" style={{ marginTop: 12, padding: "10px 14px", fontSize: 13.5 }}>
              Nicely done. That is the idea, working in your own code.
            </div>
          )}
          {!taskState && <div className="dc-ink-muted" style={{ fontSize: 12.5, fontWeight: 700, marginTop: 10 }}>Press Run to check your work.</div>}
          {task.solution && !taskState?.ok && attempts >= 2 && (
            <div style={{ marginTop: 12 }}>
              {!showSolution ? (
                <button type="button" className="dc-btn dc-btn--quiet dc-btn--sm" onClick={() => setShowSolution(true)}>
                  Show one way to do it
                </button>
              ) : (
                <div className="dc-code" style={{ padding: "6px 4px" }}>
                  <CodeEditor value={task.solution} language={language} readOnly lineNumbers={false} minHeight="0px" ariaLabel="One possible solution" />
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}

/**
 * Read + quiz assessment for lessons without a client-side runtime (C#, and the
 * framework overview lessons). Every question must be answered correctly; wrong
 * picks explain themselves and can be retried.
 */
function QuizPanel({ quiz, onPass, alreadyLearned }: { quiz: QuizQuestion[]; onPass: () => void; alreadyLearned: boolean }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => quiz.map(() => null));
  const [passed, setPassed] = useState(false);
  const correctCount = useMemo(() => quiz.filter((q, i) => picked[i] === q.answer).length, [quiz, picked]);

  if (quiz.length === 0) {
    return (
      <div className="dc-paper" style={{ padding: "22px 24px" }}>
        <p className="dc-prose" style={{ margin: 0 }}>
          This lesson is a read-through. Study the example, then continue.
        </p>
      </div>
    );
  }

  const choose = (qi: number, oi: number) => {
    const next = picked.map((p, i) => (i === qi ? oi : p));
    setPicked(next);
    if (oi === quiz[qi].answer) playChime("correct");
    if (!passed && quiz.every((q, i) => next[i] === q.answer)) {
      setPassed(true);
      onPass();
    }
  };

  return (
    <section className="dc-paper" style={{ padding: "22px 24px" }}>
      <div className="flex items-center justify-between" style={{ gap: 10 }}>
        <h2 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 19, margin: 0 }}>
          Check your understanding
        </h2>
        <span className="dc-chip dc-chip--lavender">
          {correctCount} / {quiz.length}
        </span>
      </div>
      <p className="dc-ink-muted" style={{ fontSize: 13, fontWeight: 700, margin: "4px 0 18px" }}>
        {alreadyLearned ? "You have passed this before. Answer again any time to refresh it." : `Answer all ${quiz.length} to complete this lesson and earn 15 XP.`}
      </p>

      <ol className="flex flex-col" style={{ gap: 22, listStyle: "none", padding: 0, margin: 0 }}>
        {quiz.map((q, qi) => {
          const sel = picked[qi];
          const answered = sel !== null;
          const correct = answered && sel === q.answer;
          return (
            <li key={qi}>
              <div className="dc-ink" style={{ fontSize: 15, fontWeight: 800, marginBottom: 10, lineHeight: 1.5 }}>
                {qi + 1}. <RichText text={q.prompt} />
              </div>
              <div className="flex flex-col" role="radiogroup" aria-label={`Question ${qi + 1}`} style={{ gap: 8 }}>
                {optionOrder(q.options.length, q.prompt + q.options.join("|")).map((oi) => {
                  const opt = q.options[oi];
                  const isSel = sel === oi;
                  const state = isSel ? (oi === q.answer ? "correct" : "wrong") : undefined;
                  return (
                    <button
                      key={oi}
                      type="button"
                      role="radio"
                      aria-checked={isSel}
                      onClick={() => choose(qi, oi)}
                      disabled={correct}
                      className="dc-option"
                      data-state={state}
                    >
                      <RichText text={opt} />
                    </button>
                  );
                })}
              </div>
              {answered && q.explain && (
                <div className={`dc-callout ${correct ? "dc-callout--success" : "dc-callout--danger"}`} style={{ marginTop: 8, padding: "9px 12px", fontSize: 13 }}>
                  {correct ? "✓ " : "Not quite. "}
                  {q.explain}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {passed && (
        <div className="dc-callout dc-callout--success anim-pop-in" style={{ marginTop: 20, textAlign: "center" }}>
          Lesson complete. You can move on. {"✓"}
        </div>
      )}
    </section>
  );
}
