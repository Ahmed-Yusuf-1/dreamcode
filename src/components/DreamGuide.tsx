"use client";

import { useState } from "react";

interface GuideMsg {
  from: "guide" | "you";
  text: string;
  phase?: string;
}

/**
 * The opt-in Socratic AI mentor ("Dream Guide"). Frontend-only: the
 * conversation is scripted to demonstrate the 5-phase mentor flow -
 * it asks questions and never hands over code.
 */
const SCRIPT: GuideMsg[][] = [
  [
    {
      from: "guide",
      phase: "1 · Socratic debate",
      text: "Before I peek anywhere - walk me through it. When your loop visits the list, what do you expect to happen on each turn?",
    },
  ],
  [
    { from: "you", text: "It should check each height and count the tall ones..." },
    {
      from: "guide",
      phase: "2 · Plan crystallization",
      text: "Good. Say your plan in three plain steps, no code. What happens first, then, and last?",
    },
  ],
  [
    { from: "you", text: "Start a count at 0 → check every cloud → return the count." },
    {
      from: "guide",
      phase: "3 · Test-first anchoring",
      text: "Solid plan. Now, which single input would prove your code wrong if the comparison were sloppy? Try writing a test with clouds exactly at height k.",
    },
  ],
  [
    { from: "you", text: "[5,5,5] with k=5 should give 0, because they're not above k!" },
    {
      from: "guide",
      phase: "4 · Guided implementation",
      text: "There's your edge. Look at the line that compares - does it say strictly above, or at-or-above? (Hint: > and >= mean different skies.)",
    },
  ],
  [
    { from: "you", text: "Fixed it - strictly greater. All tests pass!" },
    {
      from: "guide",
      phase: "5 · Validation",
      text: "One check before you fly on: why did [5,5,5], k=5 return 0? • A: 5 > 5 is false • B: the list is empty • C: range starts at 0. Pick one.",
    },
  ],
];

export default function DreamGuide() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const messages = SCRIPT.slice(0, step + 1).flat();

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => setOpen(true)}
        className="fixed cursor-pointer transition-transform hover:-translate-y-0.5"
        style={{
          bottom: 22,
          right: 22,
          zIndex: 60,
          border: "none",
          background: "linear-gradient(135deg, #cdb9f7, #9678BE)",
          color: "#ffffff",
          fontWeight: 900,
          fontSize: 14,
          padding: "12px 20px",
          borderRadius: 999,
          boxShadow: "0 0 24px rgba(189,128,255,.55), 0 14px 30px rgba(30,16,60,.4)",
        }}
      >
        Stuck? Ask the Dream Guide
      </button>

      {open && (
        <div
          className="fixed anim-pop-in flex flex-col"
          style={{
            bottom: 22,
            right: 22,
            zIndex: 70,
            width: "min(380px, calc(100vw - 44px))",
            maxHeight: "min(560px, calc(100vh - 44px))",
            background: "rgba(14,34,71,.96)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(189,160,255,.4)",
            borderRadius: 22,
            boxShadow: "0 0 34px rgba(189,128,255,.35), 0 28px 60px rgba(8,20,50,.6)",
            overflow: "hidden",
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.12)" }}
          >
            <div className="flex items-center" style={{ gap: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/clouds-neon/cutout-cloud-neon-1-05.webp"
                alt=""
                style={{ width: 36, height: "auto", filter: "drop-shadow(0 0 8px rgba(189,160,255,.8))" }}
              />
              <div>
                <div className="font-display" style={{ fontWeight: 800, fontSize: 16, color: "#ffffff" }}>
                  Dream Guide
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#bfa8f5" }}>
                  asks, never answers · hints cost 5 XP
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer"
              style={{
                border: "none",
                background: "rgba(255,255,255,.12)",
                color: "#ffffff",
                fontWeight: 900,
                width: 28,
                height: 28,
                borderRadius: "50%",
              }}
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ padding: "16px 16px 8px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 12, textAlign: m.from === "you" ? "right" : "left" }}>
                {m.phase && (
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: 1,
                      color: "#bfa8f5",
                      marginBottom: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    {m.phase}
                  </div>
                )}
                <div
                  style={{
                    display: "inline-block",
                    maxWidth: "88%",
                    textAlign: "left",
                    background: m.from === "guide" ? "rgba(189,160,255,.16)" : "rgba(110,230,255,.14)",
                    border: `1px solid ${m.from === "guide" ? "rgba(189,160,255,.35)" : "rgba(110,230,255,.3)"}`,
                    color: "#e8eeff",
                    fontSize: 13.5,
                    fontWeight: 600,
                    lineHeight: 1.6,
                    padding: "10px 14px",
                    borderRadius: 16,
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px 16px 16px" }}>
            {step < SCRIPT.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="w-full cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #cdb9f7, #a78ae8)",
                  color: "#241a4a",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "11px 0",
                  borderRadius: 999,
                }}
              >
                Keep thinking with me (-5 XP)
              </button>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#9fe8c0",
                  background: "rgba(110,230,160,.12)",
                  border: "1px solid rgba(110,230,160,.3)",
                  borderRadius: 12,
                  padding: "10px 12px",
                }}
              >
                You solved it yourself - the Guide just asked questions. ✓
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
