"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { spendXP, useIsSignedIn } from "@/lib/profile";
import { track } from "@/lib/telemetry";

/** What the learner is currently working on, passed in by each page. */
export interface GuideContext {
  title: string;
  instructions?: string;
  functionName?: string;
  language?: string;
  kind?: "lesson" | "practice" | "challenge" | "project";
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const HINT_COST = 5;

/**
 * The opt-in Socratic AI mentor ("Dream Guide"). It asks questions and gives
 * graduated hints, never the answer. The model call lives server-side at
 * /api/guide and is provider-agnostic (set the AI_* env vars to switch it on).
 * Signed-in only; each delivered hint costs 5 XP.
 */
export default function DreamGuide({
  context,
  getCode,
}: {
  context?: GuideContext;
  getCode?: () => string;
}) {
  const signedIn = useIsSignedIn();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // Inline state after a failed/blocked send: a friendly note to show the user.
  const [note, setNote] = useState<string | null>(null);
  const [upgradeNeeded, setUpgradeNeeded] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
        e.preventDefault();
        return;
      }
      if (e.key === "Tab") {
        if (!panelRef.current) return;
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex="0"]'
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

    // Focus the textarea when open
    setTimeout(() => {
      if (panelRef.current) {
        const inputEl = panelRef.current.querySelector<HTMLElement>("textarea, input");
        if (inputEl) {
          inputEl.focus();
        } else {
          const firstFocusable = panelRef.current.querySelector<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex="0"]'
          );
          firstFocusable?.focus();
        }
      }
    }, 50);

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, note]);

  const greeting = context?.title
    ? `You are working on "${context.title}". Tell me what you expect to happen, step by step - I will ask questions to help you get there yourself.`
    : "Tell me what you are trying to do and where it is getting stuck. I will ask questions to help you find it yourself, not hand over the answer.";

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setNote(null);
    setLoading(true);

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem: {
            title: context?.title ?? "this exercise",
            instructions: context?.instructions,
            functionName: context?.functionName,
            language: context?.language,
            kind: context?.kind,
          },
          code: getCode?.() ?? "",
          messages: next,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = typeof data.reply === "string" ? data.reply : "";
        if (reply) {
          setMessages([...next, { role: "assistant", content: reply }]);
          spendXP(HINT_COST);
          track("hint_requested", { context: context?.title || "general" });
        } else {
          setNote("The guide did not have a reply that time. Try rephrasing your question.");
        }
      } else if (res.status === 401) {
        setNote("Please sign in to ask the Dream Guide.");
      } else if (res.status === 403) {
        setUpgradeNeeded(true);
      } else if (res.status === 503) {
        setNote("The Dream Guide is not switched on yet. Once an AI provider is connected, this is where it answers.");
      } else if (res.status === 429) {
        setNote("You are asking quite fast. Give it a few seconds and try again.");
      } else {
        setNote("The guide could not answer just now. Give it another try in a moment.");
      }
    } catch {
      setNote("Could not reach the guide. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const showChat = signedIn && !upgradeNeeded;

  return (
    <>
      {/* launcher */}
      <button
        ref={launcherRef}
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
          ref={panelRef}
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
                  asks, never answers {"·"} hints cost {HINT_COST} XP
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer"
              aria-label="Close Dream Guide"
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
              {"×"}
            </button>
          </div>

          {/* signed-out: locked panel */}
          {!signedIn && (
            <div style={{ padding: "26px 22px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#e8eeff", lineHeight: 1.7, margin: "0 0 18px" }}>
                The Dream Guide is a signed-in feature. Sign in and it will sit beside you on every
                problem, asking the questions that get you unstuck without spoiling the answer.
              </p>
              <Link
                href="/login"
                className="font-display inline-block cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #cdb9f7, #a78ae8)",
                  color: "#241a4a",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "11px 22px",
                  borderRadius: 999,
                }}
              >
                Sign in to continue
              </Link>
            </div>
          )}

          {/* signed-in but gated to Pro (only when the parked flag is on) */}
          {signedIn && upgradeNeeded && (
            <div style={{ padding: "26px 22px" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#e8eeff", lineHeight: 1.7, margin: "0 0 18px" }}>
                The Dream Guide is part of dreamcode Pro. Upgrade to unlock graduated, Socratic hints
                on every challenge.
              </p>
              <Link
                href="/profile"
                className="font-display inline-block cursor-pointer transition-transform hover:-translate-y-0.5"
                style={{
                  border: "none",
                  background: "linear-gradient(135deg, #ffd66e, #ff9f43)",
                  color: "#3a2606",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "11px 22px",
                  borderRadius: 999,
                }}
              >
                See Pro
              </Link>
            </div>
          )}

          {showChat && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ padding: "16px 16px 8px" }}>
                {/* opening greeting (UI only, not sent to the model) */}
                <Bubble from="guide" text={greeting} />

                {messages.map((m, i) => (
                  <Bubble key={i} from={m.role === "assistant" ? "guide" : "you"} text={m.content} />
                ))}

                {loading && <Bubble from="guide" text="Thinking with you..." muted />}
                {note && (
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#ffd9a8",
                      background: "rgba(255,180,90,.12)",
                      border: "1px solid rgba(255,180,90,.3)",
                      borderRadius: 12,
                      padding: "10px 12px",
                      marginBottom: 12,
                    }}
                  >
                    {note}
                  </div>
                )}
              </div>

              <div style={{ padding: "10px 14px 14px", borderTop: "1px solid rgba(255,255,255,.12)" }}>
                <div className="flex items-end" style={{ gap: 8 }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    rows={1}
                    placeholder="Describe where you are stuck..."
                    className="font-body flex-1"
                    style={{
                      resize: "none",
                      maxHeight: 96,
                      background: "rgba(255,255,255,.08)",
                      border: "1px solid rgba(189,160,255,.35)",
                      borderRadius: 14,
                      color: "#eef2ff",
                      fontSize: 13.5,
                      fontWeight: 600,
                      lineHeight: 1.5,
                      padding: "10px 12px",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={send}
                    disabled={loading || !input.trim()}
                    className="cursor-pointer transition-transform hover:-translate-y-0.5"
                    style={{
                      border: "none",
                      background: "linear-gradient(135deg, #cdb9f7, #a78ae8)",
                      color: "#241a4a",
                      fontWeight: 900,
                      fontSize: 13,
                      padding: "10px 16px",
                      borderRadius: 999,
                      opacity: loading || !input.trim() ? 0.55 : 1,
                      cursor: loading || !input.trim() ? "default" : "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {loading ? "..." : `Ask (-${HINT_COST})`}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function Bubble({ from, text, muted }: { from: "guide" | "you"; text: string; muted?: boolean }) {
  return (
    <div style={{ marginBottom: 12, textAlign: from === "you" ? "right" : "left" }}>
      <div
        style={{
          display: "inline-block",
          maxWidth: "88%",
          textAlign: "left",
          whiteSpace: "pre-wrap",
          background: from === "guide" ? "rgba(189,160,255,.16)" : "rgba(110,230,255,.14)",
          border: `1px solid ${from === "guide" ? "rgba(189,160,255,.35)" : "rgba(110,230,255,.3)"}`,
          color: muted ? "#bfa8f5" : "#e8eeff",
          fontSize: 13.5,
          fontWeight: 600,
          lineHeight: 1.6,
          padding: "10px 14px",
          borderRadius: 16,
          fontStyle: muted ? "italic" : "normal",
        }}
      >
        {text}
      </div>
    </div>
  );
}
