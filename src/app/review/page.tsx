"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Cloud from "@/components/Cloud";
import { cloudOpacity } from "@/lib/theme";
import { reviewCards } from "@/lib/data";
import { getSRSStates, saveSRSState } from "@/lib/srs";
import { addXP, unlockBadge } from "@/lib/profile";
import { playChime } from "@/lib/sound";

const cs = cloudOpacity.review;
export default function ReviewPage() {
  const [srsStates, setSrsStates] = useState<Record<string, number>>({});
  const [now, setNow] = useState<number>(0);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    const states = getSRSStates();
    setTimeout(() => {
      setSrsStates(states);
      setNow(Date.now());
    }, 0);
    document.title = "Night review - dreamcode";
  }, []);

  const dueCards = now === 0 ? [] : reviewCards.filter((c) => (srsStates[c.id] ?? 0) <= now);
  const done = idx >= dueCards.length;
  const card = dueCards[idx];

  useEffect(() => {
    if (done && dueCards.length > 0 && !xpAwarded) {
      addXP(20);
      unlockBadge("streak-keeper");
      playChime("success");
      setTimeout(() => {
        setXpAwarded(true);
      }, 0);
    }
  }, [done, dueCards.length, xpAwarded]);

  const grade = useCallback((rating: "again" | "good" | "easy") => {
    if (!card) return;
    if (rating !== "again") {
      playChime("correct");
    }
    const nextDue = saveSRSState(card.id, rating);
    setSrsStates((prev) => ({ ...prev, [card.id]: nextDue }));
    setRevealed(false);
    setIdx((prevIdx) => prevIdx + 1);
  }, [card]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #131347 0%, #2b2c63 40%, #4c4096 75%, #7a5fae 100%)",
      }}
    >
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.06} pos={{ left: "-6%", top: "12%" }} width="min(420px, 33vw)" opacity={0.75} duration={15} neon="cyan" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.1} pos={{ right: "-5%", top: "44%" }} width="min(360px, 28vw)" opacity={0.7} duration={12} delay={1.2} neon="magenta" scale={cs} />
      <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp" speed={0.14} pos={{ left: "6%", bottom: "8%" }} width="min(280px, 22vw)" opacity={0.65} anim="floatySm" duration={9} delay={0.4} scale={cs} />

      {/* top bar */}
      <div
        className="relative z-6 flex items-center justify-between"
        style={{ padding: "24px 44px" }}
      >
        <Link
          href="/dashboard"
          className="cursor-pointer text-white backdrop-blur-md transition-colors hover:bg-white/30"
          style={{
            background: "rgba(255,255,255,.16)",
            border: "2px solid rgba(255,255,255,.6)",
            fontWeight: 900,
            fontSize: 13,
            padding: "9px 18px",
            borderRadius: 999,
          }}
        >
          {"\u2190"} Dashboard
        </Link>
        <div className="font-display sky-text" style={{ fontWeight: 800, fontSize: 20, color: "#ffffff" }}>
          Night review
        </div>
        <div
          className="backdrop-blur-md"
          style={{
            background: "rgba(255,255,255,.16)",
            border: "2px solid rgba(255,255,255,.6)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 13,
            padding: "9px 18px",
            borderRadius: 999,
          }}
        >
          {done ? "all clear" : `${idx + 1} of ${dueCards.length}`}
        </div>
      </div>

      <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 620, padding: "4vh 28px 90px" }}>
        {!done && (
          <>
            <p
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "rgba(255,255,255,.85)",
                margin: "0 0 26px",
                textShadow: "0 2px 14px rgba(10,8,40,.7)",
              }}
            >
              Old concepts drift back at night so they stick for good. Answer in your head, then
              flip the cloud.
            </p>

            <div
              key={card.id}
              className="anim-pop-in text-left"
              style={{
                background: "rgba(255,255,255,.12)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,.35)",
                borderRadius: 26,
                padding: "30px 32px",
                boxShadow: "0 0 40px rgba(189,128,255,.2), 0 24px 60px rgba(8,8,40,.45)",
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <span
                  style={{
                    background: "rgba(255,255,255,.85)",
                    color: "#5b4a8a",
                    fontWeight: 900,
                    fontSize: 11,
                    letterSpacing: 1,
                    padding: "5px 12px",
                    borderRadius: 999,
                  }}
                >
                  {card.concept.toUpperCase()}
                </span>
                <span style={{ fontSize: 12, fontWeight: 900, color: "#ffd9ef", textShadow: "0 0 10px rgba(255,138,222,.7)" }}>
                  {card.due}
                </span>
              </div>

              <div
                className="font-display"
                style={{ fontWeight: 800, fontSize: 24, color: "#ffffff", textShadow: "0 2px 12px rgba(10,8,40,.6)", marginBottom: 14 }}
              >
                {card.prompt}
              </div>

              {card.code && (
                <pre
                  className="font-mono"
                  style={{
                    background: "rgba(8,18,46,.85)",
                    borderRadius: 14,
                    padding: "16px 18px",
                    fontSize: 13.5,
                    lineHeight: 1.9,
                    color: "#dbe9ff",
                    margin: "0 0 16px",
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                  }}
                >
                  {card.code}
                </pre>
              )}

              {revealed ? (
                <div
                  className="anim-pop-in"
                  style={{
                    background: "rgba(110,230,160,.14)",
                    border: "1px solid rgba(110,230,160,.4)",
                    borderRadius: 14,
                    padding: "14px 16px",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#c8f5da",
                    lineHeight: 1.6,
                  }}
                >
                  {card.answer}
                </div>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="w-full cursor-pointer transition-colors hover:bg-white/24"
                  style={{
                    background: "rgba(255,255,255,.14)",
                    border: "2px dashed rgba(255,255,255,.45)",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: 15,
                    padding: "14px 0",
                    borderRadius: 14,
                  }}
                >
                  Flip the cloud
                </button>
              )}
            </div>

            {revealed && (
              <div className="anim-pop-in flex justify-center" style={{ gap: 12, marginTop: 24 }}>
                {[
                  { label: "Again \u00b7 soon", rating: "again" as const, bg: "rgba(255,150,190,.25)", border: "rgba(255,150,190,.6)" },
                  { label: "Good \u00b7 3 days", rating: "good" as const, bg: "rgba(150,220,255,.22)", border: "rgba(150,220,255,.55)" },
                  { label: "Easy \u00b7 1 week", rating: "easy" as const, bg: "rgba(150,255,200,.2)", border: "rgba(150,255,200,.5)" },
                ].map((b) => (
                  <button
                    key={b.label}
                    onClick={() => grade(b.rating)}
                    className="cursor-pointer backdrop-blur-md transition-transform hover:-translate-y-0.5"
                    style={{
                      background: b.bg,
                      border: `2px solid ${b.border}`,
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: 14,
                      padding: "11px 20px",
                      borderRadius: 999,
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {done && (
          <div className="anim-pop-in" style={{ paddingTop: "6vh" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-neon/cutout-cloud-neon-1-05.webp"
              alt=""
              className="cloud-glow"
              style={{ display: "block", width: 190, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }}
            />
            <h2
              className="font-display neon-title"
              style={{ fontWeight: 800, fontSize: 40, color: "#fff6fb", margin: "20px 0 10px" }}
            >
              Sky&apos;s clear
            </h2>
            <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.9)", maxWidth: 400, margin: "0 auto", lineHeight: 1.65 }}>
              Every due memory got a workout. The next batch drifts in tomorrow - keep the streak
              warm.
            </p>
            <div className="flex justify-center" style={{ gap: 12, marginTop: 28 }}>
              <Link
                href="/journey"
                className="font-display cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #ff7ad9, #ff4fb0)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 16,
                  padding: "13px 28px",
                  borderRadius: 999,
                  boxShadow: "0 0 26px rgba(255,100,200,.6)",
                }}
              >
                Keep learning {"\u2192"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
