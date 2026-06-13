import Link from "next/link";

/**
 * The simple, always-the-same path a learner walks: Learn, Practice, Challenge,
 * Build. Shown big on /start and compact on the dashboard so a first-time user
 * always knows the chain of actions and where they are in it.
 */
export interface FlowStep {
  n: number;
  name: string;
  blurb: string;
  href: string;
}

export const FLOW: FlowStep[] = [
  { n: 1, name: "Learn", blurb: "Read a short lesson and run the example.", href: "/lesson/loops" },
  { n: 2, name: "Practice", blurb: "Try it three ways until it sticks.", href: "/practice/loops" },
  { n: 3, name: "Challenge", blurb: "Solve a real problem on your own.", href: "/challenge/cloud-hopper" },
  { n: 4, name: "Build", blurb: "Put it together in a small project.", href: "/projects" },
];

export default function FlowSteps({
  current = 0,
  compact = false,
}: {
  current?: number;
  compact?: boolean;
}) {
  return (
    <div className="flex w-full items-stretch" style={{ gap: compact ? 8 : 14 }}>
      {FLOW.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const circleBg = done
          ? "#a9ecc9"
          : active
            ? "linear-gradient(135deg, #ff7ad9, #ff4fb0)"
            : "rgba(255,255,255,.16)";
        const circleColor = done ? "#0f5c38" : "#ffffff";
        const circleShadow = active
          ? "0 0 22px rgba(255,100,200,.7)"
          : done
            ? "0 0 16px rgba(169,236,201,.5)"
            : "none";

        return (
          <Link
            key={step.n}
            href={step.href}
            className="group relative flex flex-1 flex-col items-center text-center transition-transform hover:-translate-y-0.5"
          >
            {/* connector to the next step */}
            {i < FLOW.length - 1 && (
              <div
                className="absolute"
                style={{
                  top: compact ? 17 : 25,
                  left: "calc(50% + 22px)",
                  right: "calc(-50% + 22px)",
                  height: 3,
                  borderRadius: 99,
                  background: done ? "rgba(169,236,201,.7)" : "rgba(255,255,255,.18)",
                }}
              />
            )}

            <div
              className="font-display relative z-1 flex items-center justify-center"
              style={{
                width: compact ? 36 : 52,
                height: compact ? 36 : 52,
                borderRadius: "50%",
                background: circleBg,
                border: active ? "3px solid #ffffff" : "2px solid rgba(255,255,255,.4)",
                color: circleColor,
                fontWeight: 800,
                fontSize: compact ? 15 : 20,
                boxShadow: circleShadow,
              }}
            >
              {done ? "✓" : step.n}
            </div>

            <div
              className="font-display"
              style={{
                fontWeight: 800,
                fontSize: compact ? 13 : 17,
                color: active || done ? "#ffffff" : "rgba(255,255,255,.7)",
                marginTop: compact ? 8 : 12,
                textShadow: active ? "0 0 12px rgba(255,138,222,.7)" : "0 2px 10px rgba(20,16,50,.5)",
              }}
            >
              {step.name}
            </div>

            {!compact && (
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: active ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.65)",
                  marginTop: 4,
                  lineHeight: 1.5,
                  maxWidth: 150,
                }}
              >
                {step.blurb}
              </div>
            )}

            {active && (
              <div
                style={{
                  marginTop: compact ? 4 : 8,
                  fontSize: compact ? 10 : 12,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  color: "#ffd9ef",
                }}
              >
                YOU ARE HERE
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
