"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import FlowBar from "@/components/ui/FlowBar";
import RichText from "@/components/ui/RichText";
import Prose from "@/components/ui/Prose";
import CodeEditor, { type EditorLanguage } from "@/components/CodeEditor";
import EditorFrame, { ConsolePanel, EditorToolButton } from "@/components/EditorFrame";
import DreamGuide from "@/components/DreamGuide";
import BadgeMedallion from "@/components/BadgeMedallion";
import { cloudOpacity } from "@/lib/theme";
import type { ChallengeLanguage, ChallengeTestCase } from "@/lib/data";
import { formatCall, formatValue, gradeSubmission, type GradeResult } from "@/lib/grader";
import { completeActivity, recordSubmission, useUserProfile } from "@/lib/profile";
import { useCatalog } from "@/components/CatalogProvider";
import { RARITY } from "@/lib/badges";
import type { Badge } from "@/content/types";
import { usePyodide } from "@/lib/usePyodide";
import { useDraft } from "@/lib/useDraft";
import { playChime } from "@/lib/sound";
import { track } from "@/lib/telemetry";
import { setActiveTrackSilently } from "@/lib/track";
import { trackFromLanguage } from "@/lib/catalog";

export interface CodeTaskLink {
  href: string;
  label: string;
}

export interface CodeTaskProps {
  kind: "challenge" | "project";
  id: string;
  title: string;
  language: ChallengeLanguage;
  /** Difficulty (challenges) or tier (projects). */
  levelLabel: string;
  xp: number;
  instructions: string;
  /** Pyodide packages this task needs (numpy, pandas). Python only. */
  packages?: string[];
  starter: string;
  functionName: string;
  testCases: ChallengeTestCase[];
  hints?: string[];
  steps?: string[];
  back: CodeTaskLink;
  /** Where to go after passing. */
  onward: CodeTaskLink;
  /** Activities this builds on; a gentle note shows until they are complete. */
  requires?: string[];
  /** Human name for what it builds on, e.g. "the Functions chapter". */
  requiresLabel?: string;
}

const FILE_EXT: Record<ChallengeLanguage, string> = { Python: "py", JavaScript: "js", TypeScript: "ts" };

export default function CodeTask(props: CodeTaskProps) {
  const { kind, id, title, language, levelLabel, xp, instructions, packages, starter, functionName, testCases, hints, steps, back, onward, requires, requiresLabel } = props;
  const editorLanguage = language.toLowerCase() as EditorLanguage;
  const { value: code, setValue: setCode, reset, restored } = useDraft(`${kind}:${id}`, starter);
  const py = usePyodide(language === "Python");
  const { profile, ready } = useUserProfile();
  const catalog = useCatalog();
  const completedStops = profile.completedStops || [];
  const cleared = completedStops.includes(id);
  const missing = requires ? requires.filter((r) => !completedStops.includes(r)) : [];
  const prerequisiteNote =
    ready && !cleared && missing.length > 0 && requiresLabel
      ? `This builds on ${requiresLabel}. You can try it now, or finish that first so every idea here is familiar.`
      : null;
  const [result, setResult] = useState<GradeResult | null>(null);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState<{ xp: number; badges: string[] } | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveTrackSilently(trackFromLanguage(language));
    track(kind === "challenge" ? "challenge_started" : "project_started", { slug: id, language });
  }, [kind, id, language]);

  const runTests = useCallback(async () => {
    if (running) return;
    setRunning(true);
    openerRef.current = document.activeElement as HTMLElement | null;
    const graded = await gradeSubmission({ language, code, functionName, testCases, runPython: py.run, packages });
    setResult(graded);
    setRunning(false);

    const passed = graded.ok && graded.outcomes.every((o) => o.pass);
    const newBadges = recordSubmission(id, code, passed);
    if (passed) {
      const completion = completeActivity(id);
      track(kind === "challenge" ? "challenge_passed" : "project_completed", { slug: id, language });
      playChime(kind === "challenge" ? "badge" : "success");
      setWon({ xp: completion.xp, badges: [...newBadges, ...completion.newBadges] });
    } else {
      track(kind === "challenge" ? "challenge_failed" : "project_failed", { slug: id, language });
    }
  }, [running, language, code, functionName, testCases, packages, py.run, id, kind]);

  // Dialog: focus the primary action, trap Tab, close on Escape, restore focus.
  useEffect(() => {
    if (!won) return;
    const dialog = modalRef.current;
    const focusables = () => Array.from(dialog?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    const t = setTimeout(() => focusables()[focusables().length - 1]?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setWon(null);
      } else if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      openerRef.current?.focus?.();
    };
  }, [won]);

  const passing = result?.outcomes.filter((o) => o.pass).length ?? 0;
  const changed = code !== starter;
  // Badges are earned by rule now, so the card promises XP and names only the
  // badges this learner would actually earn next.
  const badgeCatalog = new Map(catalog.badges.map((b) => [b.id, b]));
  const wonBadges = (won?.badges ?? []).map((id) => badgeCatalog.get(id)).filter((b): b is Badge => !!b);

  return (
    <Scene clouds="calm" cloudScale={cloudOpacity.challenge}>
      <FlowBar
        back={back}
        title={title}
        meta={
          <>
            <span className="dc-chip dc-chip--mint">{levelLabel}</span>
            <span className="dc-chip dc-chip--glass">{language}</span>
          </>
        }
        right={cleared ? <span className="dc-chip dc-chip--mint">{"✓"} Cleared</span> : <span className="dc-chip dc-chip--pink">Reward: +{xp} XP</span>}
      />

      <div className="dc-container grid items-start lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)_minmax(0,300px)]" style={{ gap: 20, maxWidth: 1360, paddingTop: 26, paddingBottom: 80 }}>
        {/* brief */}
        <section className="dc-paper" style={{ padding: "24px 24px" }}>
          <span className="dc-chip dc-chip--lavender">{kind === "challenge" ? "PROBLEM" : "PROJECT BRIEF"}</span>
          <h1 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 25, lineHeight: 1.2, margin: "12px 0 10px" }}>
            {title}
          </h1>
          {prerequisiteNote && (
            <div className="dc-callout dc-callout--info" style={{ marginBottom: 14, fontSize: 13 }}>
              {prerequisiteNote}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <Prose text={instructions} />
          </div>

          {steps && steps.length > 0 && (
            <>
              <div className="dc-kicker" style={{ color: "var(--dc-ink-muted)", marginBottom: 8 }}>
                Build it step by step
              </div>
              <ol className="dc-prose" style={{ fontSize: 14, paddingLeft: 20, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                {steps.map((s, i) => (
                  <li key={i}>
                    <RichText text={s} />
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="dc-kicker" style={{ color: "var(--dc-ink-muted)", marginBottom: 8 }}>
            Examples
          </div>
          {testCases.slice(0, 2).map((tc, idx) => (
            <div key={idx} className="dc-inset font-mono" style={{ padding: "11px 14px", fontSize: 12.5, lineHeight: 1.75, marginBottom: 10, overflowX: "auto" }}>
              <div className="dc-ink" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {formatCall(functionName, tc.args, language)}
              </div>
              <div style={{ color: "var(--dc-success-fg)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {"→"} {formatValue(tc.expected, language)}
              </div>
            </div>
          ))}

          {hints && hints.length > 0 && (
            <div style={{ marginTop: 14 }}>
              {hints.slice(0, hintsShown).map((h, i) => (
                <div key={i} className="dc-callout dc-callout--warn" style={{ marginBottom: 8, fontSize: 13.5 }}>
                  <strong>Hint {i + 1}:</strong> <RichText text={h} />
                </div>
              ))}
              {hintsShown < hints.length && (
                <button type="button" className="dc-btn dc-btn--quiet dc-btn--sm" onClick={() => setHintsShown((n) => n + 1)}>
                  {hintsShown === 0 ? "Need a nudge?" : "Another hint"}
                </button>
              )}
            </div>
          )}
        </section>

        {/* editor + console */}
        <div className="flex min-w-0 flex-col" style={{ gap: 14 }}>
          <EditorFrame
            filename={`${kind === "challenge" ? "solution" : "project"}.${FILE_EXT[language]}`}
            language={language.toUpperCase()}
            toolbar={
              changed ? (
                <EditorToolButton onClick={reset} label="Reset the editor to the starter code">
                  Reset
                </EditorToolButton>
              ) : null
            }
            footer={
              <div className="flex flex-wrap items-center justify-between" style={{ padding: "4px 16px 14px", gap: 10 }}>
                <span className="font-mono" style={{ fontSize: 11.5, color: "#9db8e8" }}>
                  {running ? "Running your tests..." : restored ? "Draft restored · saved as you type" : "Saved as you type"}
                </span>
                <button type="button" onClick={runTests} disabled={running} className="dc-btn dc-btn--run dc-btn--sm" style={{ fontSize: 14, padding: "9px 22px" }} title="Run tests (Ctrl or Cmd + Enter)">
                  {running ? "Running..." : "▶ Run tests"}
                </button>
              </div>
            }
          >
            <div style={{ padding: "8px 6px 4px" }}>
              <CodeEditor value={code} onChange={setCode} language={editorLanguage} minHeight="300px" onRun={runTests} ariaLabel={`${title} solution editor`} />
            </div>
          </EditorFrame>
          {result && (result.logs.length > 0 || !result.ok) && (
            <ConsolePanel
              lines={result.logs}
              errorLines={result.ok ? undefined : result.errorDetail ?? (result.error ? [result.error] : undefined)}
              note={result.ok ? undefined : { text: "Your code could not run all the way through. Fix the error, then run the tests again.", ok: false }}
            />
          )}
        </div>

        {/* tests + reward */}
        <div className="flex min-w-0 flex-col lg:col-span-2 xl:col-span-1" style={{ gap: 16 }}>
          <section className="dc-paper" style={{ padding: "20px 20px", borderRadius: 20 }} aria-live="polite">
            <div className="flex items-center justify-between" style={{ marginBottom: 12, gap: 8 }}>
              <h2 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 17, margin: 0 }}>
                Tests
              </h2>
              <span className={`dc-chip ${result && passing === testCases.length ? "dc-chip--mint" : "dc-chip--lavender"}`}>
                {passing} of {testCases.length} passing
              </span>
            </div>
            <ul className="flex flex-col" style={{ gap: 9, listStyle: "none", padding: 0, margin: 0 }}>
              {testCases.map((t, i) => {
                const outcome = result?.outcomes[i];
                const state = !result ? "idle" : outcome?.pass ? "pass" : "fail";
                return (
                  <li
                    key={i}
                    style={{
                      background: state === "pass" ? "var(--dc-success-bg)" : state === "fail" ? "var(--dc-danger-bg)" : "var(--dc-inset-bg)",
                      border: `1px solid ${state === "pass" ? "var(--dc-success-border)" : state === "fail" ? "var(--dc-danger-border)" : "var(--dc-inset-border)"}`,
                      borderRadius: 12,
                      padding: "9px 11px",
                      fontSize: 12,
                      lineHeight: 1.6,
                      overflowX: "auto",
                    }}
                  >
                    <div className="flex items-start" style={{ gap: 8 }}>
                      <span
                        aria-label={state === "pass" ? "passed" : state === "fail" ? "failed" : "not run yet"}
                        style={{
                          flexShrink: 0,
                          fontWeight: 900,
                          color: state === "pass" ? "var(--dc-success-fg)" : state === "fail" ? "var(--dc-danger-fg)" : "var(--dc-ink-muted)",
                        }}
                      >
                        {state === "pass" ? "✓" : state === "fail" ? "✗" : "•"}
                      </span>
                      <div className="min-w-0 dc-ink" style={{ wordBreak: "break-word" }}>
                        <div style={{ fontWeight: 800, fontSize: 13 }}>{t.label}</div>
                        {state !== "pass" && (
                          <div className="font-mono" style={{ fontSize: 11.5, marginTop: 3 }}>
                            <div className="dc-ink-soft">{formatCall(functionName, t.args, language)}</div>
                            <div className="dc-ink-muted">expected {formatValue(t.expected, language)}</div>
                            {state === "fail" && outcome && (
                              <div style={{ color: "var(--dc-danger-fg)" }}>
                                {outcome.error ? outcome.error : `got ${formatValue(outcome.actual, language)}`}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="dc-paper text-center" style={{ padding: "20px 20px", borderRadius: 20 }}>
            <div className="dc-kicker" style={{ color: "var(--dc-ink-muted)", marginBottom: 10 }}>
              On the line
            </div>
            <div style={{ width: 96, margin: "0 auto" }}>
              <BadgeMedallion icon={kind === "challenge" ? "peak" : "blocks"} accent={kind === "challenge" ? "#6ea8ff" : "#b98cff"} found />
            </div>
            <div className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 17, marginTop: 10 }}>
              +{xp} XP
            </div>
            <div className="dc-ink-muted" style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>
              {cleared ? "Cleared. Replaying is great practice, but it will not pay XP again." : `Pass all ${testCases.length} tests to claim it.`}
            </div>
          </section>
        </div>
      </div>

      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(20,16,50,.55)", backdropFilter: "blur(6px)", padding: 16 }}>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-won-title"
            className="dc-paper anim-pop-in text-center"
            style={{ padding: "34px 34px", maxWidth: 400, width: "100%" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/clouds-neon/cutout-cloud-neon-1-04.webp" alt="" className="cloud-glow" style={{ display: "block", width: 150, height: "auto", margin: "0 auto", animation: "floatySm 4s ease-in-out infinite" }} />
            <h2 id="task-won-title" className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 28, marginTop: 12 }}>
              {kind === "challenge" ? "Every test passed!" : "Project complete!"}
            </h2>
            <p className="dc-ink-soft" style={{ fontWeight: 700, fontSize: 15, margin: "8px 0 6px", lineHeight: 1.55 }}>
              {won.xp > 0 ? `${title} is yours.` : "Solved again. Nice and sharp."}
            </p>
            <div className="flex flex-wrap justify-center" style={{ gap: 8, marginTop: 6 }}>
              <span className="dc-chip dc-chip--butter dc-chip--lg">{won.xp > 0 ? `+${won.xp} XP` : "No new XP on a replay"}</span>
            </div>
            {wonBadges.length > 0 && (
              <div className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 14 }}>
                {wonBadges.map((badge) => (
                  <div key={badge.id} style={{ width: 84 }}>
                    <BadgeMedallion icon={badge.icon} accent={badge.accent} found ring={RARITY[badge.rarity].ring} />
                    <div className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 12.5, marginTop: 6, lineHeight: 1.25 }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: RARITY[badge.rarity].ring }}>{RARITY[badge.rarity].label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 24 }}>
              <button type="button" onClick={() => setWon(null)} className="dc-btn dc-btn--quiet dc-btn--sm">
                Stay here
              </button>
              <Link href={onward.href} className="dc-btn dc-btn--primary dc-btn--sm" style={{ fontSize: 15 }}>
                {onward.label}
              </Link>
            </div>
          </div>
        </div>
      )}

      <DreamGuide
        context={{ title, instructions, functionName, language, kind }}
        getCode={() => code}
      />
    </Scene>
  );
}
