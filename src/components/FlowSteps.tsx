import Link from "next/link";

/**
 * The simple, always-the-same path a learner walks: Learn, Practice, Challenge,
 * Build. Shown big on /start and compact on the dashboard so a first-time user
 * always knows the chain of actions and where they are in it. Each step links
 * to the learner's real next action when the caller knows it.
 */
export interface FlowStep {
  n: number;
  name: string;
  blurb: string;
}

export const FLOW: FlowStep[] = [
  { n: 1, name: "Learn", blurb: "Read a short lesson and run the example." },
  { n: 2, name: "Practice", blurb: "Predict, arrange and fill in until it sticks." },
  { n: 3, name: "Challenge", blurb: "Solve a real problem that is graded by tests." },
  { n: 4, name: "Build", blurb: "Put it together in a small project." },
];

const DEFAULT_LINKS = ["/lessons", "/lessons", "/peaks", "/projects"];

export default function FlowSteps({
  current = 0,
  compact = false,
  links = DEFAULT_LINKS,
}: {
  current?: number;
  compact?: boolean;
  links?: string[];
}) {
  return (
    <ol className="flex w-full items-stretch" style={{ gap: compact ? 6 : 14, listStyle: "none", padding: 0, margin: 0 }}>
      {FLOW.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.n} className="relative flex flex-1">
            {i < FLOW.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute"
                style={{
                  top: compact ? 17 : 25,
                  left: "calc(50% + 22px)",
                  right: "calc(-50% + 22px)",
                  height: 3,
                  borderRadius: 99,
                  background: done ? "rgba(169,236,201,.7)" : "rgba(255,255,255,.2)",
                }}
              />
            )}
            <Link
              href={links[i] ?? DEFAULT_LINKS[i]}
              aria-current={active ? "step" : undefined}
              className="group relative flex flex-1 flex-col items-center text-center transition-transform hover:-translate-y-0.5"
            >
              <span
                className="font-display relative flex items-center justify-center"
                style={{
                  zIndex: 1,
                  width: compact ? 36 : 52,
                  height: compact ? 36 : 52,
                  borderRadius: "50%",
                  background: done ? "var(--dc-mint)" : active ? "var(--dc-accent)" : "rgba(255,255,255,.16)",
                  border: active ? "3px solid #ffffff" : "2px solid rgba(255,255,255,.45)",
                  color: done ? "var(--dc-mint-ink)" : "#ffffff",
                  fontWeight: 800,
                  fontSize: compact ? 15 : 20,
                  boxShadow: active ? "0 0 22px var(--dc-accent-glow)" : "none",
                }}
              >
                {done ? "✓" : step.n}
              </span>
              <span
                className="font-display"
                style={{
                  fontWeight: 800,
                  fontSize: compact ? 13 : 17,
                  color: active || done ? "#ffffff" : "rgba(255,255,255,.75)",
                  marginTop: compact ? 8 : 12,
                  textShadow: "var(--dc-sky-text-shadow)",
                }}
              >
                {step.name}
              </span>
              {!compact && (
                <span style={{ fontSize: 13, fontWeight: 600, color: active ? "rgba(255,255,255,.92)" : "rgba(255,255,255,.72)", marginTop: 4, lineHeight: 1.5, maxWidth: 160 }}>
                  {step.blurb}
                </span>
              )}
              {active && (
                <span style={{ marginTop: compact ? 4 : 8, fontSize: compact ? 10 : 12, fontWeight: 900, letterSpacing: 0.5, color: "var(--dc-kicker)" }}>
                  YOU ARE HERE
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
