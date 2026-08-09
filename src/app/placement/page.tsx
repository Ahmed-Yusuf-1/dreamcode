"use client";

import { useState } from "react";
import { completeActivity } from "@/lib/profile";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import { playChime } from "@/lib/sound";
import { track } from "@/lib/telemetry";
import { useActiveTrack, type Track } from "@/lib/track";
import { getModules } from "@/lib/curriculum";

type Question = {
  id: number;
  question: string;
  options: { id: string; label: string; correct: boolean; why: string }[];
};

const PYTHON_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "How do you output text to the screen in Python?",
    options: [
      { id: "A", label: "console.log(\"Hello\")", correct: false, why: "Close! That is JavaScript." },
      { id: "B", label: "print(\"Hello\")", correct: true, why: "Correct! Python uses the print() function to write to the console." },
      { id: "C", label: "echo \"Hello\"", correct: false, why: "Nope, that is Bash / PHP style." },
    ],
  },
  {
    id: 2,
    question: "Which of these is a valid way to start a loop in Python?",
    options: [
      { id: "A", label: "for i in range(5):", correct: true, why: "Correct! Python loops use 'in' and end with a colon." },
      { id: "B", label: "foreach i in range(5) {", correct: false, why: "No, foreach and braces are not Python syntax." },
      { id: "C", label: "for (let i = 0; i < 5; i++)", correct: false, why: "No, that is the standard C / JavaScript loop." },
    ],
  },
  {
    id: 3,
    question: "What does this expression evaluate to: len([10, 20, 30])?",
    options: [
      { id: "A", label: "30", correct: false, why: "No, that is the last element, not the length." },
      { id: "B", label: "3", correct: true, why: "Correct! The len() function returns the number of elements in a list." },
      { id: "C", label: "1", correct: false, why: "No, that would be the minimum or index offset." },
    ],
  },
];

const QUESTION_BANKS: Record<Track, Question[]> = {
  python: PYTHON_QUESTIONS,
  javascript: [
    { id: 1, question: "How do you output text in JavaScript?", options: [
      { id: "A", label: 'console.log("Hello")', correct: true, why: "Correct! console.log writes to the developer console." },
      { id: "B", label: 'print("Hello")', correct: false, why: "That is Python syntax." },
      { id: "C", label: 'Console.WriteLine("Hello")', correct: false, why: "That is C# syntax." },
    ] },
    { id: 2, question: "Which keyword declares a value that will not be reassigned?", options: [
      { id: "A", label: "const", correct: true, why: "Correct! const prevents reassignment." },
      { id: "B", label: "fixed", correct: false, why: "fixed is not the JavaScript declaration keyword." },
      { id: "C", label: "def", correct: false, why: "def belongs to Python functions." },
    ] },
    { id: 3, question: "What does [10, 20, 30].length return?", options: [
      { id: "A", label: "30", correct: false, why: "That is the final value, not the array length." },
      { id: "B", label: "3", correct: true, why: "Correct! The array contains three values." },
      { id: "C", label: "2", correct: false, why: "2 is the last index, not the length." },
    ] },
  ],
  typescript: [
    { id: 1, question: "Which annotation declares a string?", options: [
      { id: "A", label: "let name: string", correct: true, why: "Correct! Type annotations follow a colon." },
      { id: "B", label: "string name", correct: false, why: "That is not TypeScript declaration order." },
      { id: "C", label: "let name as string", correct: false, why: "as is used for assertions, not this declaration." },
    ] },
    { id: 2, question: "Which operator creates a union type?", options: [
      { id: "A", label: "&", correct: false, why: "& creates an intersection." },
      { id: "B", label: "|", correct: true, why: "Correct! string | number is a union." },
      { id: "C", label: "||", correct: false, why: "|| is a runtime logical operator." },
    ] },
    { id: 3, question: "What does an interface describe?", options: [
      { id: "A", label: "The shape of a value", correct: true, why: "Correct! Interfaces name object contracts." },
      { id: "B", label: "A loop condition", correct: false, why: "Interfaces describe types, not control flow." },
      { id: "C", label: "A database table only", correct: false, why: "They can model many kinds of object values." },
    ] },
  ],
  csharp: [
    { id: 1, question: "How do you output a line in C#?", options: [
      { id: "A", label: 'Console.WriteLine("Hello");', correct: true, why: "Correct! Console.WriteLine prints a line." },
      { id: "B", label: 'console.log("Hello")', correct: false, why: "That is JavaScript." },
      { id: "C", label: 'print("Hello")', correct: false, why: "That is Python." },
    ] },
    { id: 2, question: "Which declaration stores a whole number?", options: [
      { id: "A", label: "int count = 3;", correct: true, why: "Correct! int is the whole-number type." },
      { id: "B", label: "number count = 3;", correct: false, why: "number is a TypeScript type." },
      { id: "C", label: "count := 3", correct: false, why: "That is not C# declaration syntax." },
    ] },
    { id: 3, question: "Which collection has a Count property?", options: [
      { id: "A", label: "List<int>", correct: true, why: "Correct! List<T>.Count reports its item count." },
      { id: "B", label: "A namespace", correct: false, why: "Namespaces group code; they are not collections." },
      { id: "C", label: "A using directive", correct: false, why: "using imports a namespace or manages a resource." },
    ] },
  ],
};

const cs = cloudOpacity.practice;

export default function PlacementPage() {
  const { track: activeTrack } = useActiveTrack();
  const [step, setStep] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const questions = QUESTION_BANKS[activeTrack];
  const trackLessons = getModules(activeTrack).flatMap((module) => module.lessons);
  const recommendedLesson = trackLessons[score === questions.length ? Math.min(2, trackLessons.length - 1) : 0];

  const q = questions[currentQ];

  const handleSelect = (id: string, correct: boolean) => {
    if (picked) return; // Prevent double pick
    setPicked(id);
    if (correct) {
      setScore((s) => s + 1);
      playChime("correct");
    }
  };

  const handleNext = () => {
    setPicked(null);
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setStep("result");
      completeActivity(`placement:${activeTrack}`);
      track("placement_completed", { track: activeTrack });
      playChime("success");
    }
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setPicked(null);
    setStep("welcome");
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip px-4 py-16"
      style={{
        background: "linear-gradient(180deg, #1a1c52 0%, #2b2c63 26%, #4c4096 62%, #8E95CE 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.07} pos={{ right: "-3%", top: "4%" }} width="min(380px, 30vw)" opacity={0.8} duration={16} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.05} pos={{ left: "-5%", bottom: "6%" }} width="min(360px, 27vw)" opacity={0.75} duration={18} delay={1.6} scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-01.webp" speed={0.13} pos={{ right: "10%", bottom: "20%" }} width="min(240px, 20vw)" opacity={0.7} anim="floatySm" duration={9} delay={0.5} neon="magenta" scale={cs} />

      {/* spacer to clear fixed global nav */}
      <div style={{ height: "var(--nav-h)" }} />

      <div className="relative z-10 w-full max-w-lg">
        {step === "welcome" && (
          <div
            className="anim-pop-in text-center"
            style={{
              background: "rgba(255, 255, 255, 0.16)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.45)",
              borderRadius: 24,
              padding: "36px 32px",
              boxShadow: "0 18px 44px rgba(20,12,50,.3)",
            }}
          >
            <h1 className="font-display text-4xl font-extrabold text-white" style={{ textShadow: "0 2px 14px rgba(30,16,60,.7)" }}>
              Placement Flight
            </h1>
            <p className="mt-4 text-base font-bold text-white/90" style={{ textShadow: "0 2px 10px rgba(10,8,40,.6)" }}>
              Answer three quick questions to locate your entry point in the dreamcode sky. We will fly you to the stop that matches your current skill.
            </p>
            <button
              onClick={() => setStep("quiz")}
              className="font-display mt-8 cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{
                border: "none",
                background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 17,
                padding: "12px 34px",
                borderRadius: 999,
                boxShadow: "0 0 24px rgba(255,100,200,.65), 0 14px 30px rgba(20,10,50,.45)",
              }}
            >
              Launch flight {"\u2192"}
            </button>
          </div>
        )}

        {step === "quiz" && (
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
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <span
                style={{
                  background: "#e6e0fb",
                  color: "#5b4a8a",
                  fontWeight: 900,
                  fontSize: 11,
                  letterSpacing: 0.8,
                  padding: "5px 12px",
                  borderRadius: 999,
                }}
              >
                QUESTION {currentQ + 1} OF {questions.length}
              </span>
              <span className="font-mono text-sm font-bold text-[#5b4a8a]">Score: {score}</span>
            </div>

            <h2 className="font-display text-2xl font-extrabold text-[#13335f] leading-snug">
              {q.question}
            </h2>

            <div className="mt-6 flex flex-col" style={{ gap: 12 }}>
              {q.options.map((o) => {
                const isPicked = picked === o.id;
                const showExplanation = picked !== null;

                return (
                  <button
                    key={o.id}
                    disabled={picked !== null}
                    onClick={() => handleSelect(o.id, o.correct)}
                    className="text-left transition-all"
                    style={{
                      background: isPicked
                        ? o.correct
                          ? "#effaf3"
                          : "#fdeff3"
                        : showExplanation && o.correct
                          ? "#effaf3"
                          : "#f3f7fc",
                      border: `2px solid ${
                        isPicked
                          ? o.correct
                            ? "#7fd6a4"
                            : "#ffa8c2"
                          : showExplanation && o.correct
                            ? "#7fd6a4"
                            : "#e2ecf7"
                      }`,
                      borderRadius: 14,
                      padding: "14px 18px",
                      fontSize: 14.5,
                      fontWeight: 700,
                      color: "#2c4a7c",
                      cursor: picked === null ? "pointer" : "default",
                      opacity: showExplanation && !isPicked && !o.correct ? 0.65 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{o.label}</span>
                      {isPicked && (o.correct ? "✓" : "✗")}
                    </div>
                    {isPicked && (
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: o.correct ? "#0f8a52" : "#a13163",
                          marginTop: 6,
                        }}
                      >
                        {o.why}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
                  style={{
                    border: "none",
                    background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: 15,
                    padding: "10px 24px",
                    borderRadius: 999,
                    boxShadow: "0 0 16px rgba(255,100,200,.5), 0 10px 20px rgba(20,10,50,.3)",
                  }}
                >
                  {currentQ < questions.length - 1 ? "Next question \u2192" : "See landing spot \u2192"}
                </button>
              </div>
            )}
          </div>
        )}

        {step === "result" && (
          <div
            className="anim-pop-in text-center"
            style={{
              background: "rgba(255, 255, 255, 0.16)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.45)",
              borderRadius: 24,
              padding: "38px 32px",
              boxShadow: "0 18px 44px rgba(20,12,50,.3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-neon/cutout-cloud-neon-1-01.webp"
              alt=""
              className="cloud-glow mx-auto"
              style={{ display: "block", width: 140, height: "auto", animation: "floatySm 5s ease-in-out infinite" }}
            />
            <h2 className="font-display text-3xl font-extrabold text-white mt-4" style={{ textShadow: "0 2px 14px rgba(30,16,60,.7)" }}>
              Flight Landed!
            </h2>
            <p className="mt-2 text-lg font-bold text-white/95" style={{ textShadow: "0 2px 10px rgba(10,8,40,.6)" }}>
              You scored {score} out of {questions.length}
            </p>
            <div
              className="mx-auto mt-6 max-w-sm rounded-2xl bg-white/10 px-6 py-5 text-left text-sm font-semibold text-white/95"
              style={{ border: "1px solid rgba(255,255,255,.2)" }}
            >
              {score === questions.length ? (
                <>
                  <div className="font-bold text-[#ffe49a]" style={{ fontSize: 16, marginBottom: 4 }}>
                    🚀 Level: Adept Pilot
                  </div>
                  We recommend starting at <strong className="text-[#a9ecc9]">{recommendedLesson?.catalogTitle}</strong>. You have a solid grasp of the opening ideas in this track.
                </>
              ) : (
                <>
                  <div className="font-bold text-[#ffb6d9]" style={{ fontSize: 16, marginBottom: 4 }}>
                    ✨ Level: Sky Explorer
                  </div>
                  We recommend starting from the beginning: <strong className="text-[#a9ecc9]">{recommendedLesson?.catalogTitle}</strong>. Let&apos;s consolidate your flight controls.
                </>
              )}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={restartQuiz}
                className="font-display cursor-pointer bg-white/15 hover:bg-white/25 border border-white/40 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
              >
                Retry
              </button>
              <Link
                href={recommendedLesson ? `/lesson/${recommendedLesson.slug}` : "/journey"}
                className="font-display cursor-pointer transition-transform hover:-translate-y-0.5 flex items-center"
                style={{
                  background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                  color: "#ffffff",
                  fontWeight: 850,
                  fontSize: 14.5,
                  padding: "10px 26px",
                  borderRadius: 999,
                  boxShadow: "0 0 20px rgba(255,100,200,.6), 0 10px 20px rgba(20,10,50,.35)",
                }}
              >
                Fly to {recommendedLesson?.catalogTitle || "your journey"} {"\u2192"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
