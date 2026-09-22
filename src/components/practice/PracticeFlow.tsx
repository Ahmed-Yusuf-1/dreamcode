"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import FlowBar from "@/components/ui/FlowBar";
import RichText from "@/components/ui/RichText";
import DreamGuide from "@/components/DreamGuide";
import { ConsolePanel } from "@/components/EditorFrame";
import { cloudOpacity } from "@/lib/theme";
import { optionOrder } from "@/lib/optionOrder";
import type { PracticeDataset } from "@/lib/data";
import type { LessonLink, TrackId } from "@/lib/curriculum";
import { completeActivity, type CompletionResult } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import { track } from "@/lib/telemetry";
import { useCodeRunner, type RunOutcome } from "@/lib/useCodeRunner";

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = ["Predict", "Arrange", "Fill in"];

interface LessonInfo {
  slug: string;
  title: string;
  catalogTitle: string;
  language: TrackId;
}

export default function PracticeFlow({
  slug,
  data,
  lesson,
  next,
  chapterEnd,
  sectionChallenge,
}: {
  slug: string;
  data: PracticeDataset;
  lesson: LessonInfo;
  next: LessonLink | null;
  chapterEnd: boolean;
  sectionChallenge: { slug: string; name: string } | null;
}) {
  const [step, setStep] = useState<Step>(0);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("practice_started", { slug });
  }, [slug]);

  const advance = (to: Step) => {
    setStep(to);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Scene clouds="calm" cloudScale={cloudOpacity.practice}>
      <div ref={topRef} style={{ scrollMarginTop: "calc(var(--nav-h) + 8px)" }} />
      <FlowBar
        back={{ href: `/lesson/${lesson.slug}`, label: "Lesson" }}
        title={`Practice · ${lesson.catalogTitle}`}
        meta={
          <ol className="flex items-center" style={{ gap: 6, listStyle: "none", padding: 0, margin: 0 }} aria-label="Practice steps">
            {STEP_LABELS.map((label, i) => (
              <li
                key={label}
                aria-current={i === step ? "step" : undefined}
                className="dc-chip"
                style={{
                  fontSize: 11,
                  padding: "4px 11px",
                  background: i < step ? "var(--dc-mint)" : i === step ? "var(--dc-accent)" : "rgba(255,255,255,.16)",
                  color: i < step ? "var(--dc-mint-ink)" : i === step ? "#ffffff" : "rgba(255,255,255,.75)",
                }}
              >
                {i < step ? `✓ ${label}` : label}
              </li>
            ))}
          </ol>
        }
        right={<span className="dc-chip dc-chip--butter">+20 XP on finish</span>}
      />

      <div className="dc-container" style={{ maxWidth: 780, paddingTop: 34, paddingBottom: 90 }}>
        {step === 0 && <PredictStep data={data} language={lesson.language} onDone={() => advance(1)} />}
        {step === 1 && <ParsonsStep data={data} onDone={() => advance(2)} />}
        {step === 2 && <FadedStep data={data} onDone={() => advance(3)} />}
        {step === 3 && <DoneStep slug={slug} lesson={lesson} next={next} chapterEnd={chapterEnd} sectionChallenge={sectionChallenge} />}
      </div>

      <DreamGuide context={{ title: `Practice: ${lesson.title}`, instructions: data.prompt, language: lesson.language, kind: "practice" }} />
    </Scene>
  );
}

function PracticeCard({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="dc-paper anim-pop-in" style={{ padding: "clamp(22px, 3.4vw, 34px)" }}>
      <span className="dc-chip dc-chip--lavender">{kicker}</span>
      <h1 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: "clamp(23px, 3vw, 28px)", lineHeight: 1.2, margin: "14px 0 10px" }}>
        {title}
      </h1>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="dc-code" style={{ padding: "16px 20px", fontSize: 14, lineHeight: 1.85, margin: "0 0 18px", whiteSpace: "pre-wrap", overflowX: "auto" }}>
      {code}
    </pre>
  );
}

/* ---------- step 1: predict (read before you write) ---------- */

function PredictStep({ data, language, onDone }: { data: PracticeDataset; language: TrackId; onDone: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const chosen = data.predictOptions.find((o) => o.id === picked);
  const runnable = language !== "csharp";
  const { run, running } = useCodeRunner(language === "javascript" ? "javascript" : language === "typescript" ? "typescript" : "python");
  const [ran, setRan] = useState<RunOutcome | null>(null);

  return (
    <PracticeCard kicker="PREDICT · READ BEFORE YOU WRITE" title={data.predictQuestion}>
      <p className="dc-prose" style={{ fontSize: 15, margin: "0 0 16px" }}>
        Trace the program the way the computer would, then make your call before running anything.
      </p>
      <CodeBlock code={data.predictCode} />
      <div className="flex flex-col" role="radiogroup" aria-label="Your prediction" style={{ gap: 10 }}>
        {optionOrder(data.predictOptions.length, data.predictQuestion + data.predictCode).map((index) => {
          const o = data.predictOptions[index];
          const isPicked = picked === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={isPicked}
              disabled={!!chosen?.correct}
              onClick={() => {
                setPicked(o.id);
                if (o.correct) playChime("correct");
                else setMisses((m) => m + 1);
              }}
              className="dc-option"
              data-state={isPicked ? (o.correct ? "correct" : "wrong") : chosen?.correct && o.correct ? "reveal" : undefined}
            >
              <span className="font-mono" style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>
                {o.label}
              </span>
              {isPicked && (
                <span className="dc-option__why">
                  {o.correct ? "✓ " : "✗ "}
                  {o.why}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!chosen?.correct && misses >= 2 && (
        <p className="dc-ink-muted" style={{ fontSize: 13, fontWeight: 700, marginTop: 12 }}>
          Tip: go line by line and write down each variable&apos;s value as it changes.
        </p>
      )}
      {chosen?.correct && (
        <div className="anim-fade-up" style={{ marginTop: 18 }}>
          {runnable && (
            <div style={{ marginBottom: 16 }}>
              {!ran ? (
                <button
                  type="button"
                  className="dc-btn dc-btn--run dc-btn--sm"
                  disabled={running}
                  onClick={async () => setRan(await run(data.predictCode, undefined, { packages: data.packages }))}
                >
                  {running ? "Running..." : "▶ Run it and see"}
                </button>
              ) : (
                <ConsolePanel lines={ran.lines} errorLines={ran.errorLines} note={{ text: ran.summary, ok: ran.ok }} label="What really happens" />
              )}
            </div>
          )}
          <div className="flex justify-end">
            <button type="button" className="dc-btn dc-btn--primary" onClick={onDone}>
              Next: arrange it {"→"}
            </button>
          </div>
        </div>
      )}
    </PracticeCard>
  );
}

/* ---------- step 2: Parsons problem (arrange the fragments) ---------- */

function shuffledIds(ids: string[], texts: string[]): string[] {
  if (ids.length < 2) return ids;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const copy = [...ids];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    const order = copy.map((id) => texts[ids.indexOf(id)]).join("\n");
    if (order !== texts.join("\n")) return copy;
  }
  return [...ids].reverse();
}

function ParsonsStep({ data, onDone }: { data: PracticeDataset; onDone: () => void }) {
  const fragments = data.parsonsFragments;
  const byId = useMemo(() => new Map(fragments.map((f) => [f.id, f])), [fragments]);
  const [tray, setTray] = useState<string[]>(() => fragments.map((f) => f.id));
  const [solution, setSolution] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | { ok: boolean; firstWrong: number }>(null);

  // Shuffle on the client only (keeps server and client markup identical).
  useEffect(() => {
    const t = setTimeout(() => setTray(shuffledIds(fragments.map((f) => f.id), fragments.map((f) => `${f.indent}|${f.text}`))), 0);
    return () => clearTimeout(t);
  }, [fragments]);

  const place = (id: string) => {
    setTray((t) => t.filter((x) => x !== id));
    setSolution((s) => [...s, id]);
    setChecked(null);
  };
  const unplace = (id: string) => {
    setSolution((s) => s.filter((x) => x !== id));
    setTray((t) => [...t, id]);
    setChecked(null);
  };
  const reset = () => {
    setTray(shuffledIds(fragments.map((f) => f.id), fragments.map((f) => `${f.indent}|${f.text}`)));
    setSolution([]);
    setChecked(null);
  };

  const check = () => {
    // Compare the program text, not fragment ids, so identical lines (two
    // closing braces) are interchangeable.
    const want = fragments.map((f) => `${f.indent}|${f.text.trim()}`);
    const got = solution.map((id) => {
      const f = byId.get(id)!;
      return `${f.indent}|${f.text.trim()}`;
    });
    let firstWrong = got.findIndex((line, i) => line !== want[i]);
    if (firstWrong === -1 && got.length !== want.length) firstWrong = got.length;
    const ok = firstWrong === -1;
    setChecked({ ok, firstWrong });
    if (ok) {
      playChime("correct");
      setTimeout(onDone, 1100);
    }
  };

  const chip = (indent: number, extra?: React.CSSProperties): React.CSSProperties => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "var(--dc-code-bg)",
    color: "#dbe9ff",
    borderRadius: 12,
    padding: `10px 14px 10px ${14 + indent * 26}px`,
    fontSize: 13.5,
    cursor: "pointer",
    border: "2px solid transparent",
    whiteSpace: "pre",
    overflowX: "auto",
    ...extra,
  });

  return (
    <PracticeCard kicker="ARRANGE · LOGIC BEFORE SYNTAX" title="Build the program from its pieces">
      <p className="dc-prose" style={{ fontSize: 15, margin: "0 0 18px" }}>
        <RichText text={data.prompt} /> Tap a piece to place it; tap a placed line to send it back.
      </p>

      <div className="dc-kicker" style={{ color: "var(--dc-ink-muted)", marginBottom: 8 }}>
        Your program
      </div>
      <div
        className="flex flex-col font-mono"
        style={{
          gap: 7,
          background: "var(--dc-inset-bg)",
          borderRadius: 16,
          padding: 12,
          minHeight: 120,
          marginBottom: 18,
          border: `2px ${checked ? "solid" : "dashed"} ${checked?.ok ? "var(--dc-success-border)" : checked ? "var(--dc-danger-border)" : "var(--dc-inset-border)"}`,
        }}
      >
        {solution.length === 0 && (
          <div className="dc-ink-muted" style={{ fontSize: 13, fontWeight: 700, padding: "24px 0", textAlign: "center", fontFamily: "var(--font-nunito)" }}>
            Place the first line here
          </div>
        )}
        {solution.map((id, i) => {
          const f = byId.get(id)!;
          const wrong = checked && !checked.ok && i === checked.firstWrong;
          return (
            <button
              key={id}
              type="button"
              onClick={() => unplace(id)}
              className="font-mono"
              aria-label={`Remove line ${i + 1}: ${f.text}`}
              style={chip(f.indent, wrong ? { borderColor: "#ff9ecf" } : undefined)}
            >
              {f.text}
            </button>
          );
        })}
      </div>

      <div className="dc-kicker" style={{ color: "var(--dc-ink-muted)", marginBottom: 8 }}>
        Pieces
      </div>
      <div className="flex flex-col font-mono" style={{ gap: 7, marginBottom: 20 }}>
        {tray.length === 0 && (
          <div className="dc-ink-muted" style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--font-nunito)" }}>
            All pieces placed. Check your program.
          </div>
        )}
        {tray.map((id) => {
          const f = byId.get(id)!;
          return (
            <button key={id} type="button" onClick={() => place(id)} className="font-mono" aria-label={`Place: ${f.text}`} style={chip(0, { background: "#41608f" })}>
              {f.text}
            </button>
          );
        })}
      </div>

      {checked && !checked.ok && (
        <div className="dc-callout dc-callout--danger anim-shake" style={{ marginBottom: 14 }}>
          {checked.firstWrong >= solution.length
            ? "So far so good. Some pieces are still missing."
            : `Line ${checked.firstWrong + 1} is not where it belongs yet. Think about what has to happen first.`}
        </div>
      )}
      {checked?.ok && <div className="dc-callout dc-callout--success" style={{ marginBottom: 14 }}>{"✓"} That is the shape. Order and indentation match.</div>}

      <div className="flex flex-wrap justify-end" style={{ gap: 12 }}>
        <button type="button" className="dc-btn dc-btn--quiet" onClick={reset}>
          Start over
        </button>
        <button type="button" className="dc-btn dc-btn--primary" onClick={check} disabled={solution.length === 0}>
          Check my program
        </button>
      </div>
    </PracticeCard>
  );
}

/* ---------- step 3: faded example (fill the blanks) ---------- */

/** Whitespace and quote style never decide a blank; spelling and case do. */
function normalizeBlank(value: string) {
  return value.replace(/\s+/g, "").replace(/"/g, "'");
}

function FadedStep({ data, onDone }: { data: PracticeDataset; onDone: () => void }) {
  const allBlanks = data.fadedLines.flatMap((l) => l.blanks);
  const [values, setValues] = useState<string[]>(allBlanks.map(() => ""));
  const [wrong, setWrong] = useState<boolean[] | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);

  const check = () => {
    const result = allBlanks.map((b, i) => normalizeBlank(values[i]) !== normalizeBlank(b));
    setWrong(result);
    setAttempts((a) => a + 1);
    if (result.every((w) => !w)) {
      setSolved(true);
      playChime("correct");
      setTimeout(onDone, 1300);
    }
  };

  const reveal = () => {
    setValues(allBlanks);
    setWrong(allBlanks.map(() => false));
  };

  const lineOffsets = data.fadedLines.map((_, li) => data.fadedLines.slice(0, li).reduce((n, l) => n + l.blanks.length, 0));

  return (
    <PracticeCard kicker="FILL IN · THE SCAFFOLD FADES" title="Finish the faded program">
      <p className="dc-prose" style={{ fontSize: 15, margin: "0 0 18px" }}>
        <RichText text={data.fadedPrompt} />
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <div className="dc-code" style={{ padding: "16px 18px", fontSize: 14, lineHeight: 2.5, marginBottom: 18, overflowX: "auto" }}>
          {data.fadedLines.map((line, li) => {
            const parts = line.text.split("___");
            return (
              <div key={li} style={{ whiteSpace: "pre" }}>
                {parts.map((part, pi) => {
                  if (pi === parts.length - 1) return <span key={pi}>{part}</span>;
                  const i = lineOffsets[li] + pi;
                  const bad = wrong?.[i];
                  return (
                    <span key={pi}>
                      {part}
                      <input
                        value={values[i]}
                        aria-label={`Blank ${i + 1}`}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        onChange={(e) => {
                          const next = [...values];
                          next[i] = e.target.value;
                          setValues(next);
                          setWrong(null);
                        }}
                        className="font-mono"
                        style={{
                          width: `${Math.max(3, allBlanks[i].length + 2)}ch`,
                          background: "rgba(255,255,255,.1)",
                          border: `2px solid ${bad ? "#ff9ecf" : wrong && !bad ? "#7fd6a4" : "rgba(150,245,255,.5)"}`,
                          borderRadius: 8,
                          color: "#ffe49a",
                          fontSize: 13.5,
                          padding: "2px 6px",
                          outline: "none",
                          textAlign: "center",
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        {wrong && wrong.some(Boolean) && (
          <div className="dc-callout dc-callout--danger" style={{ marginBottom: 14 }}>
            {wrong.filter(Boolean).length === 1 ? "One blank is not right yet" : `${wrong.filter(Boolean).length} blanks are not right yet`} (marked in pink). Code is exact about spelling and capital letters.
          </div>
        )}
        {solved && <div className="dc-callout dc-callout--success" style={{ marginBottom: 14 }}>{"✓"} <RichText text={data.fadedExplain} /></div>}

        <div className="flex flex-wrap justify-end" style={{ gap: 12 }}>
          {attempts >= 2 && !solved && (
            <button type="button" className="dc-btn dc-btn--quiet" onClick={reveal}>
              Show the answers
            </button>
          )}
          <button type="submit" className="dc-btn dc-btn--primary" disabled={solved}>
            Check the blanks
          </button>
        </div>
      </form>
    </PracticeCard>
  );
}

/* ---------- step 4: done ---------- */

function DoneStep({
  slug,
  lesson,
  next,
  chapterEnd,
  sectionChallenge,
}: {
  slug: string;
  lesson: LessonInfo;
  next: LessonLink | null;
  chapterEnd: boolean;
  sectionChallenge: { slug: string; name: string } | null;
}) {
  const [earned, setEarned] = useState<number | null>(null);

  useEffect(() => {
    const results: CompletionResult[] = [completeActivity(`practice:${slug}`), completeActivity(lesson.slug)];
    const xp = results.reduce((n, r) => n + r.xp, 0);
    const t = setTimeout(() => setEarned(xp), 0);
    track("practice_completed", { slug });
    playChime("success");
    return () => clearTimeout(t);
  }, [slug, lesson.slug]);

  const nextLesson = next ? { href: `/lesson/${next.slug}`, label: `Next: ${next.title} →` } : null;
  const challenge = sectionChallenge ? { href: `/challenge/${sectionChallenge.slug}`, label: `★ Section challenge: ${sectionChallenge.name}` } : null;

  let primary: { href: string; label: string };
  let secondary: { href: string; label: string } | null;
  if (chapterEnd) {
    primary = { href: `/review?lesson=${encodeURIComponent(lesson.slug)}`, label: "Chapter review →" };
    secondary = challenge ?? nextLesson ?? { href: "/journey", label: "Back to the map" };
  } else {
    primary = nextLesson ?? challenge ?? { href: "/peaks", label: "Climb a Problem Peak →" };
    secondary = { href: "/journey", label: "Back to the map" };
  }

  return (
    <div className="anim-pop-in text-center" style={{ padding: "24px 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/clouds-neon/cutout-cloud-neon-1-01.webp" alt="" className="cloud-glow" style={{ display: "block", width: 170, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }} />
      <h1 className="dc-title neon-title" style={{ fontSize: "clamp(30px, 4vw, 38px)", marginTop: 18 }}>
        Practice complete!
      </h1>
      <p className="dc-lede">
        {chapterEnd
          ? "That wraps the chapter. A quick review of everything in it locks it in before you move on."
          : "You read it, arranged it and finished it: the same idea, three different ways. It will come back in your night review."}
      </p>
      <div className="dc-chip dc-chip--butter dc-chip--lg" style={{ marginTop: 16 }}>
        {earned === null ? "Saving..." : earned > 0 ? `+${earned} XP` : "Already practiced, no new XP"}
      </div>
      <div className="flex flex-wrap justify-center" style={{ gap: 14, marginTop: 28 }}>
        <Link href={primary.href} className="dc-btn dc-btn--primary">
          {primary.label}
        </Link>
        {secondary && (
          <Link href={secondary.href} className="dc-btn dc-btn--secondary">
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}
