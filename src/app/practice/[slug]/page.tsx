"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import DreamGuide from "@/components/DreamGuide";
import { practiceDatasets, PracticeDataset } from "@/lib/data";
import { addXP, unlockBadge, completeStop } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import { getAdjacent, getLesson } from "@/lib/curriculum";
import { track } from "@/lib/telemetry";

type Step = 0 | 1 | 2 | 3;
const STEP_LABELS = ["Predict", "Arrange", "Fill in", "Done"];

const cs = cloudOpacity.practice;

export default function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const data = practiceDatasets[slug];
  if (!data) notFound();

  const [step, setStep] = useState<Step>(0);

  // Determine back href based on slug
  const backHref = slug === "loops" ? "/lesson/loops" : `/lesson/${slug}`;

  return (
    <div
      className="relative"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a1c52 0%, #2b2c63 26%, #4c4096 62%, #8E95CE 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.07} pos={{ right: "-3%", top: "4%" }} width="min(380px, 30vw)" opacity={0.8} duration={16} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.05} pos={{ left: "-5%", bottom: "6%" }} width="min(360px, 27vw)" opacity={0.75} duration={18} delay={1.6} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp" speed={0.13} pos={{ right: "10%", bottom: "20%" }} width="min(240px, 20vw)" opacity={0.7} anim="floatySm" duration={9} delay={0.5} neon="magenta" scale={cs} />

      {/* top bar */}
      <div
        className="sticky z-20 flex flex-wrap items-center justify-between backdrop-blur-lg"
        style={{ top: "var(--nav-h)", gap: 12, padding: "12px clamp(16px, 4vw, 32px)", background: "rgba(24,20,70,.55)", borderBottom: "1px solid rgba(255,255,255,.18)" }}
      >
        <Link
          href={backHref}
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
          {"\u2190"} Back to lesson
        </Link>
        <div className="flex items-center" style={{ gap: 14 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: "#ffffff" }}>
            Practice {"\u00b7"} {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </div>
          <div className="flex items-center" style={{ gap: 6 }}>
            {STEP_LABELS.slice(0, 3).map((label, i) => (
              <span
                key={label}
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  padding: "4px 12px",
                  borderRadius: 999,
                  background:
                    i < step
                      ? "rgba(169,236,201,.9)"
                      : i === step
                        ? "linear-gradient(135deg, #ff7ad9, #ff4fb0)"
                        : "rgba(255,255,255,.18)",
                  color: i < step ? "#0f5c38" : i === step ? "#ffffff" : "rgba(255,255,255,.75)",
                  boxShadow: i === step ? "0 0 14px rgba(255,100,200,.6)" : undefined,
                }}
              >
                {i < step ? `✓ ${label}` : label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 13, padding: "8px 16px", borderRadius: 999 }}>
          +20 XP on finish
        </div>
      </div>

      <div className="relative z-5 mx-auto" style={{ maxWidth: 760, padding: "40px 28px 90px" }}>
        {step === 0 && <PredictStep data={data} onDone={() => setStep(1)} />}
        {step === 1 && <ParsonsStep data={data} onDone={() => setStep(2)} />}
        {step === 2 && <FadedStep data={data} onDone={() => setStep(3)} />}
        {step === 3 && <DoneStep slug={slug} />}
      </div>

      <DreamGuide
        context={{
          title: `Practice: ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
          instructions: data.prompt,
          language: getLesson(slug)?.language,
          kind: "practice",
        }}
      />
    </div>
  );
}

/* ---------- shared card chrome ---------- */

function PracticeCard({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <div
      className="anim-pop-in"
      style={{
        background: "rgba(255,255,255,.93)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,.8)",
        borderRadius: 24,
        boxShadow: "0 0 34px rgba(255,150,220,.18), 0 24px 56px rgba(10,8,40,.45)",
        padding: "34px 36px",
      }}
    >
      <span
        style={{
          background: "#e6e0fb",
          color: "#5b4a8a",
          fontWeight: 900,
          fontSize: 12,
          letterSpacing: 0.8,
          padding: "6px 14px",
          borderRadius: 999,
        }}
      >
        {kicker}
      </span>
      <h1 className="font-display" style={{ fontWeight: 800, fontSize: 28, color: "#13335f", margin: "16px 0 10px" }}>
        {title}
      </h1>
      {children}
    </div>
  );
}

function NextButton({ onClick, label = "Next \u2192" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
      style={{
        border: "none",
        background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
        color: "#ffffff",
        fontWeight: 800,
        fontSize: 16,
        padding: "12px 28px",
        borderRadius: 999,
        boxShadow: "0 0 22px rgba(255,100,200,.5), 0 14px 30px rgba(20,10,50,.4)",
      }}
    >
      {label}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="font-mono"
      style={{
        background: "#0e2247",
        borderRadius: 16,
        padding: "18px 20px",
        fontSize: 14,
        lineHeight: 1.9,
        color: "#dbe9ff",
        margin: "0 0 20px",
        whiteSpace: "pre-wrap",
      }}
    >
      {code}
    </pre>
  );
}

/* ---------- step 1: predict (read before write) ---------- */

function PredictStep({ data, onDone }: { data: PracticeDataset; onDone: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = data.predictOptions.find((o) => o.id === picked);

  return (
    <PracticeCard kicker="PREDICT · READ BEFORE YOU WRITE" title={data.predictQuestion}>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#41608f", margin: "0 0 16px", lineHeight: 1.6 }}>
        Read the program like the computer would, then call the output before you run anything.
      </p>
      <CodeBlock code={data.predictCode} />
      <div className="flex flex-col" style={{ gap: 10 }}>
        {data.predictOptions.map((o) => {
          const isPicked = picked === o.id;
          return (
            <button
              key={o.id}
              onClick={() => {
                setPicked(o.id);
                if (o.correct) playChime("correct");
              }}
              className="cursor-pointer text-left transition-colors"
              style={{
                background: isPicked ? (o.correct ? "#effaf3" : "#fdeff3") : "#f3f7fc",
                border: `2px solid ${isPicked ? (o.correct ? "#7fd6a4" : "#ffa8c2") : "#e2ecf7"}`,
                borderRadius: 14,
                padding: "13px 16px",
                fontSize: 14.5,
                fontWeight: 700,
                color: "#2c4a7c",
              }}
            >
              {o.label}
              {isPicked && (
                <div style={{ fontSize: 13, fontWeight: 600, color: o.correct ? "#0f8a52" : "#a13163", marginTop: 6 }}>
                  {o.correct ? "✓ " : "✗ "}
                  {o.why}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {chosen?.correct && (
        <div className="flex justify-end" style={{ marginTop: 22 }}>
          <NextButton onClick={onDone} />
        </div>
      )}
    </PracticeCard>
  );
}

/* ---------- step 2: Parsons problem (arrange the fragments) ---------- */

function ParsonsStep({ data, onDone }: { data: PracticeDataset; onDone: () => void }) {
  const correct = data.parsonsFragments;
  const [tray, setTray] = useState(() =>
    [...correct].sort(() => 0.5 - Math.random()).map((f) => f.id),
  );
  const [solution, setSolution] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const frag = (id: string) => correct.find((f) => f.id === id)!;

  const moveToSolution = (id: string) => {
    setTray(tray.filter((t) => t !== id));
    setSolution([...solution, id]);
    setChecked(null);
  };
  const moveBack = (id: string) => {
    setSolution(solution.filter((s) => s !== id));
    setTray([...tray, id]);
    setChecked(null);
  };
  const check = () => {
    const ok = solution.length === correct.length && solution.every((id, i) => id === correct[i].id);
    setChecked(ok);
    if (ok) {
      playChime("correct");
      setTimeout(onDone, 1200);
    }
  };

  const chipStyle = (indent: number): React.CSSProperties => ({
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "#0e2247",
    color: "#dbe9ff",
    borderRadius: 12,
    padding: `11px 16px 11px ${16 + indent * 28}px`,
    fontSize: 13.5,
    cursor: "pointer",
    border: "2px solid transparent",
  });

  return (
    <PracticeCard kicker="ARRANGE · LOGIC BEFORE SYNTAX" title="Build the program from its pieces">
      <p style={{ fontSize: 15, fontWeight: 600, color: "#41608f", margin: "0 0 18px", lineHeight: 1.6 }}>
        {data.prompt} Tap a piece to place it; tap again to take it back.
      </p>

      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.8, color: "#7b93b8", marginBottom: 8 }}>YOUR PROGRAM</div>
      <div
        className="flex flex-col font-mono"
        style={{
          gap: 8,
          background: "#f1f7fe",
          borderRadius: 16,
          padding: 14,
          minHeight: 130,
          marginBottom: 18,
          border: checked === true ? "2px solid #7fd6a4" : checked === false ? "2px solid #ffa8c2" : "2px dashed #c9dcf0",
        }}
      >
        {solution.length === 0 && (
          <div style={{ color: "#7b93b8", fontSize: 13, fontWeight: 600, padding: "26px 0", textAlign: "center" }}>
            - place the first line here -
          </div>
        )}
        {solution.map((id) => (
          <button key={id} onClick={() => moveBack(id)} className="font-mono" style={chipStyle(frag(id).indent)}>
            {frag(id).text}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.8, color: "#7b93b8", marginBottom: 8 }}>PIECES</div>
      <div className="flex flex-col font-mono" style={{ gap: 8, marginBottom: 20 }}>
        {tray.map((id) => (
          <button key={id} onClick={() => moveToSolution(id)} className="font-mono" style={{ ...chipStyle(0), background: "#41608f" }}>
            {frag(id).text}
          </button>
        ))}
      </div>

      {checked === false && (
        <div style={{ color: "#a13163", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
          ✗ Not quite - try matching the logic from the lessons.
        </div>
      )}
      {checked === true && (
        <div style={{ color: "#0f8a52", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
          ✓ That&apos;s the shape - order and indentations match perfectly!
        </div>
      )}

      <div className="flex justify-end">
        <NextButton onClick={check} label="Check my program" />
      </div>
    </PracticeCard>
  );
}

/* ---------- step 3: faded example (fill the blanks) ---------- */

function FadedStep({ data, onDone }: { data: PracticeDataset; onDone: () => void }) {
  const allBlanks = data.fadedLines.flatMap((l) => l.blanks);
  const [values, setValues] = useState<string[]>(allBlanks.map(() => ""));
  const [checked, setChecked] = useState<null | boolean>(null);

  const check = () => {
    const ok = allBlanks.every((b, i) => values[i].trim().toLowerCase() === b.toLowerCase());
    setChecked(ok);
    if (ok) {
      playChime("correct");
      setTimeout(onDone, 1200);
    }
  };

  // index of each line's first blank within the flat allBlanks array
  const lineOffsets = data.fadedLines.map((_, li) =>
    data.fadedLines.slice(0, li).reduce((n, l) => n + l.blanks.length, 0),
  );

  return (
    <PracticeCard kicker="FILL IN · THE SCAFFOLD FADES" title="Finish the faded program">
      <p style={{ fontSize: 15, fontWeight: 600, color: "#41608f", margin: "0 0 18px", lineHeight: 1.6 }}>
        {data.fadedPrompt}
      </p>

      <div
        className="font-mono"
        style={{ background: "#0e2247", borderRadius: 16, padding: "18px 20px", fontSize: 14, lineHeight: 2.4, color: "#dbe9ff", marginBottom: 18 }}
      >
        {data.fadedLines.map((line, li) => {
          const parts = line.text.split("___");
          return (
            <div key={li} style={{ whiteSpace: "pre" }}>
              {parts.map((part, pi) => {
                if (pi === parts.length - 1) return <span key={pi}>{part}</span>;
                const i = lineOffsets[li] + pi;
                return (
                  <span key={pi}>
                    {part}
                    <input
                      value={values[i]}
                      onChange={(e) => {
                        const next = [...values];
                        next[i] = e.target.value;
                        setValues(next);
                        setChecked(null);
                      }}
                      className="font-mono"
                      style={{
                        width: 64,
                        background: "rgba(255,255,255,.1)",
                        border: `2px solid ${checked === false ? "#ffa8c2" : checked === true ? "#7fd6a4" : "rgba(150,245,255,.5)"}`,
                        borderRadius: 8,
                        color: "#ffe49a",
                        fontSize: 13.5,
                        padding: "3px 8px",
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

      {checked === false && (
        <div style={{ color: "#a13163", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>
          ✗ Not quite - verify the syntax and spelling of your inputs.
        </div>
      )}
      {checked === true && (
        <div style={{ color: "#0f8a52", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>✓ {data.fadedExplain}</div>
      )}

      <div className="flex justify-end">
        <NextButton onClick={check} label="Check the blanks" />
      </div>
    </PracticeCard>
  );
}

/* ---------- step 4: done ---------- */

function DoneStep({ slug }: { slug: string }) {
  useEffect(() => {
    addXP(20);
    completeStop(`practice:${slug}`);
    unlockBadge("first-loop");
    // Finishing practice also marks the owning lesson learned (and awards its XP),
    // because in the new flow the lesson is only completed once practice is passed.
    const owner = getLesson(slug);
    if (owner) {
      addXP(15);
      completeStop(owner.slug);
    }
    track("practice_completed", { slug });
    playChime("success");
  }, [slug]);

  const lesson = getLesson(slug);
  const nextLesson = getAdjacent(slug).next;
  // Chapter checkpoint: if the next lesson begins a new module, guide a quick
  // night review before the next chapter - a sprinkled, structured review beat
  // so the learner is led through the loop instead of choosing where to go.
  const nextFull = nextLesson ? getLesson(nextLesson.slug) : null;
  const ownerModule = lesson?.module || lesson?.chapter;
  const nextModule = nextFull?.module || nextFull?.chapter;
  const isChapterEnd = !!(ownerModule && nextModule && ownerModule !== nextModule);
  let nextHref = "/peaks";
  let nextLabel = "Climb a peak \u2192";

  if (nextLesson) {
    nextHref = `/lesson/${nextLesson.slug}`;
    nextLabel = `Next: ${nextLesson.title} \u2192`;
  } else {
    const lang = lesson?.language || "python";
    if (lang === "javascript") {
      nextHref = "/challenge/cloud-hopper";
    } else {
      nextHref = "/challenge/rain-counter";
    }
  }

  return (
    <div className="anim-pop-in text-center" style={{ padding: "30px 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/clouds-neon/cutout-cloud-neon-1-01.webp"
        alt=""
        className="cloud-glow"
        style={{ display: "block", width: 180, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }}
      />
      <h2 className="font-display neon-title" style={{ fontWeight: 800, fontSize: 36, color: "#fff6fb", margin: "20px 0 8px" }}>
        Practice complete!
      </h2>
      <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.9)", maxWidth: 440, margin: "0 auto", lineHeight: 1.65, textShadow: "0 2px 12px rgba(10,8,40,.6)" }}>
        {isChapterEnd
          ? "That wraps the chapter. A quick night review locks it in before you move on to the next one."
          : "You read it, you arranged it, you finished it - that's the whole loop, three different ways. It comes back in your reviews in a few days."}
      </p>
      <div
        className="inline-block"
        style={{ marginTop: 16, background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 14, padding: "8px 18px", borderRadius: 999 }}
      >
        +20 XP · review scheduled
      </div>
      <div className="flex flex-wrap justify-center" style={{ gap: 12, marginTop: 28 }}>
        {/* The guided next step is always the primary (pink) button; at a chapter
            boundary that primary step is the night review. */}
        <Link
          href={isChapterEnd ? "/review" : nextHref}
          className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 16,
            padding: "12px 26px",
            borderRadius: 999,
            boxShadow: "0 0 24px rgba(255,100,200,.55), 0 14px 30px rgba(20,10,50,.45)",
          }}
        >
          {isChapterEnd ? "Night review →" : nextLabel}
        </Link>
        <Link
          href={isChapterEnd ? nextHref : "/journey"}
          className="font-display cursor-pointer backdrop-blur-sm transition-colors hover:bg-[rgba(110,230,255,.22)]"
          style={{
            background: "rgba(24,22,60,.4)",
            border: "2px solid rgba(150,245,255,.85)",
            color: "#eefcff",
            fontWeight: 700,
            fontSize: 16,
            padding: "12px 24px",
            borderRadius: 999,
          }}
        >
          {isChapterEnd ? nextLabel : "Back to the map"}
        </Link>
      </div>
    </div>
  );
}
