import Link from "next/link";
import Cloud from "@/components/Cloud";
import StreakFlame from "@/components/StreakFlame";
import { HeroStartCta, FinalStartCta, ContinueCard } from "@/components/JourneyCtas";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";
import { getTrackLessons, lessons } from "@/lib/curriculum";
import { badges, challenges, practiceDatasets, projects } from "@/lib/data";

const cs = cloudOpacity.home;

/** Rounds a count down to a friendly "120+" style figure. */
function roughly(n: number) {
  if (n < 20) return String(n);
  const step = n >= 100 ? 10 : 5;
  return `${Math.floor(n / step) * step}+`;
}

const TRACK_CARDS = [
  {
    id: "python" as const,
    name: "Python",
    status: "RUNS IN YOUR BROWSER",
    body: "The friendliest road into programming: variables and loops to classes, algorithms and your first real project.",
    code: (
      <>
        <div>
          <span style={{ color: "#ff9ecf" }}>for</span> star <span style={{ color: "#ff9ecf" }}>in</span> night_sky:
        </div>
        <div>
          {"    "}
          <span style={{ color: "#9ad1ff" }}>wish</span>(star)
        </div>
      </>
    ),
  },
  {
    id: "javascript" as const,
    name: "JavaScript",
    status: "RUNS IN YOUR BROWSER",
    body: "The language the web dreams in, from your first function to closures, promises, async code and the event loop.",
    code: (
      <>
        <div>
          clouds.<span style={{ color: "#9ad1ff" }}>filter</span>(c <span style={{ color: "#ff9ecf" }}>=&gt;</span> c.glows)
        </div>
        <div>
          {"  "}.<span style={{ color: "#9ad1ff" }}>map</span>(hop)
        </div>
      </>
    ),
  },
  {
    id: "typescript" as const,
    name: "TypeScript",
    status: "TYPE-CHECKED, THEN RUN",
    body: "JavaScript with a safety net. Real type checking catches mistakes before your code ever runs.",
    code: (
      <div>
        <span style={{ color: "#ff9ecf" }}>let</span> stars<span style={{ color: "#ff9ecf" }}>:</span> <span style={{ color: "#c9b5ff" }}>number</span> = <span style={{ color: "#b5f1c9" }}>100</span>;
      </div>
    ),
  },
  {
    id: "csharp" as const,
    name: "C#",
    status: "READ + QUIZ",
    body: "Typed and everywhere, from games to enterprise. Learn the .NET essentials through worked examples and quizzes.",
    code: (
      <div>
        <span style={{ color: "#9ad1ff" }}>Console</span>.<span style={{ color: "#9ad1ff" }}>WriteLine</span>(<span style={{ color: "#ffe49a" }}>&quot;hello, sky&quot;</span>);
      </div>
    ),
  },
];

export default function Home() {
  const stats: [string, string][] = [
    [roughly(lessons.length), "bite-size lessons"],
    [roughly(Object.keys(practiceDatasets).length), "practice drills"],
    [roughly(Object.keys(challenges).length + projects.length), "graded challenges"],
  ];

  return (
    <div className="dc-home" style={{ overflowX: "clip" }}>
      {/* ============ HERO ============ */}
      <section className="dc-home-hero relative overflow-hidden" style={{ minHeight: "max(100vh, 820px)", background: "#4c4096" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/backgrounds/bg-dusk-neon-clouds-1.webp" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 40%" }} />

        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.1} pos={{ left: "-5%", top: "30%" }} width="min(440px, 34vw)" opacity={0.88} duration={13} />
        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.16} pos={{ right: "-4%", top: "16%" }} width="min(380px, 29vw)" opacity={0.82} duration={10} delay={1.3} />
        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp" speed={0.22} pos={{ left: "16%", top: "6%" }} width="250px" opacity={0.7} anim="floatySm" duration={8} delay={0.6} />
        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-16.webp" speed={0.07} pos={{ right: "8%", bottom: "12%" }} width="min(420px, 31vw)" opacity={0.78} duration={15} delay={0.9} />

        <div className="pointer-events-none absolute inset-0 z-2" style={{ background: "linear-gradient(180deg, #6E8FC7 0%, #F0AABE 100%)", opacity: gradientOpacity.home }} />

        <div className="relative z-5 text-center" style={{ padding: "calc(var(--nav-h) + 11vh) 20px 0" }}>
          <div className="anim-neon-flicker">
            <h1 className="font-display neon-title" style={{ fontWeight: 800, fontSize: "min(100px, 15vw)", lineHeight: 1, color: "#fff6fb", margin: 0 }}>
              dreamcode
            </h1>
          </div>
          <div className="neon-outline inline-block" style={{ marginTop: 24, padding: "9px 26px", borderRadius: 999, color: "#eefcff", fontWeight: 800, fontSize: 15, letterSpacing: 6, backdropFilter: "blur(4px)" }}>
            LEARN {"·"} SOLVE {"·"} DREAM
          </div>
          <p className="sky-text" style={{ fontSize: "clamp(16px, 2.2vw, 19px)", lineHeight: 1.65, color: "#ffffff", fontWeight: 700, maxWidth: 560, margin: "26px auto 0", textWrap: "pretty" }}>
            Learn to code by writing real code from the very first minute. Python, JavaScript and TypeScript run right in your browser, with C# as a read and quiz track.
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 16, marginTop: 36 }}>
            <HeroStartCta />
            <Link href="/peaks" className="dc-btn dc-btn--secondary dc-btn--lg">
              Try a problem
            </Link>
          </div>
        </div>

        <div className="dc-side-float dc-chip dc-chip--glass dc-chip--lg absolute z-6" style={{ left: "6%", top: "44%", animation: "floaty 7s ease-in-out infinite", backdropFilter: "blur(10px)" }} aria-hidden="true">
          <StreakFlame /> 7-day streak
        </div>
        <div className="dc-side-float dc-chip dc-chip--glass dc-chip--lg absolute z-6" style={{ right: "7%", top: "50%", animation: "floaty 9s ease-in-out 1.2s infinite", backdropFilter: "blur(10px)" }} aria-hidden="true">
          +15 XP tonight
        </div>
        <ContinueCard />

        {/* Pinned to the bottom of the hero on wide screens; on phones it flows
            under the buttons so nothing overlaps. */}
        <div className="relative z-5 px-4 pb-10 pt-12 md:absolute md:inset-x-0 md:bottom-12 md:p-0">
          <dl className="flex flex-wrap justify-center" style={{ gap: "12px 38px", margin: 0 }}>
            {stats.map(([num, label]) => (
              <div key={label} className="flex flex-col-reverse text-center">
                {/* dt first for screen readers; column-reverse shows the number on top */}
                <dt style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,248,252,.92)" }}>{label}</dt>
                <dd className="font-display" style={{ fontWeight: 800, fontSize: 30, color: "#ffffff", textShadow: "0 0 16px rgba(255,170,220,.9)", margin: 0 }}>
                  {num}
                </dd>
              </div>
            ))}
          </dl>
          <div className="text-center" style={{ marginTop: 18, fontSize: 13, fontWeight: 800, color: "rgba(255,250,255,.8)", textWrap: "balance" }}>
            Free to start {"·"} No setup, the editor lives in your browser {"↓"}
          </div>
        </div>
      </section>

      {/* ============ THE STORY: one continuous, theme-aware sky ============ */}
      <div className="dc-home-story relative">
        <section className="relative" style={{ padding: "90px 20px 60px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.06} pos={{ right: "-6%", top: "8%" }} width="min(420px, 32vw)" opacity={0.75} duration={14} scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.12} pos={{ left: "-4%", bottom: "-6%" }} width="min(340px, 27vw)" opacity={0.7} duration={11} delay={1.2} scale={cs} />

          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 1020 }}>
            <div className="neon-outline inline-block" style={{ padding: "7px 20px", borderRadius: 999, color: "#eefcff", fontWeight: 900, fontSize: 12, letterSpacing: 3 }}>
              WHY IT WORKS
            </div>
            <h2 className="dc-title glow-heading" style={{ fontSize: "clamp(30px, 4.6vw, 42px)", margin: "18px 0 12px" }}>
              Most tutorials watch you copy.
              <br />
              Here, you fly solo from line one.
            </h2>
            <p className="dc-lede" style={{ marginBottom: 46 }}>
              Tutorial hell is real: you finish ten courses and still freeze at an empty editor. dreamcode is built backwards from that problem.
            </p>

            <div className="grid grid-cols-1 text-left md:grid-cols-3" style={{ gap: 18 }}>
              {[
                { img: "/assets/clouds-neon/cutout-cloud-neon-1-01.webp", title: "You write every line", body: "No passive videos. Every idea becomes your code within seconds: predict it, arrange it, then write it yourself and watch it run." },
                { img: "/assets/clouds-neon/cutout-cloud-neon-1-05.webp", title: "Your memory does laps", body: "Every lesson comes back as a night review card, timed by spaced repetition for right before you would forget it." },
                { img: "/assets/clouds-neon/cutout-cloud-neon-1-02.webp", title: "Stuck is a feature", body: "Real tests show exactly what your code returned. The Dream Guide asks the question that unsticks you, never the answer." },
              ].map((c) => (
                <div key={c.title} className="dc-glass glow-hover" style={{ padding: "26px 26px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" className="cloud-glow" style={{ width: 92, height: "auto", animation: "floatySm 7s ease-in-out infinite" }} />
                  <h3 className="font-display" style={{ fontWeight: 800, fontSize: 21, margin: "12px 0 8px" }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: "var(--dc-on-sky-soft)", lineHeight: 1.65, margin: 0 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative" style={{ padding: "60px 20px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-10.webp" speed={0.05} pos={{ left: "-8%", top: "10%" }} width="min(480px, 36vw)" opacity={0.7} duration={16} scale={cs} />
          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 980 }}>
            <h2 className="dc-title glow-heading" style={{ fontSize: "clamp(30px, 4.4vw, 40px)" }}>
              How a night flows
            </h2>
            <p className="dc-lede" style={{ marginBottom: 44 }}>
              Four small moves, over and over, until the language is simply yours.
            </p>
            <ol className="grid grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16, listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { n: "01", name: "Learn", body: "A short idea with a worked example, then your turn in a live editor.", color: "rgba(255,138,222,.95)" },
                { n: "02", name: "Practice", body: "Predict the output, arrange the pieces, fill the fading blanks.", color: "rgba(150,245,255,.95)" },
                { n: "03", name: "Apply", body: "Climb a Problem Peak: a prompt, real tests and your own plan.", color: "rgba(255,228,154,.95)" },
                { n: "04", name: "Review", body: "Days later it drifts back as a card. You catch it. Now it sticks.", color: "rgba(189,160,255,.95)" },
              ].map((s) => (
                <li key={s.n} className="dc-glass" style={{ padding: "22px 22px" }}>
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 30, color: s.color, textShadow: `0 0 18px ${s.color}` }}>
                    {s.n}
                  </div>
                  <h3 className="font-display" style={{ fontWeight: 800, fontSize: 20, margin: "6px 0" }}>
                    {s.name}
                  </h3>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dc-on-sky-soft)", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="relative" style={{ padding: "60px 20px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.08} pos={{ right: "-4%", top: "10%" }} width="min(360px, 28vw)" opacity={0.75} duration={12} delay={0.8} scale={cs} />
          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 940 }}>
            <h2 className="dc-title glow-heading" style={{ fontSize: "clamp(30px, 4.4vw, 40px)" }}>
              Four languages, one road
            </h2>
            <p className="dc-lede" style={{ marginBottom: 44 }}>
              Pick a track and follow its chapters from your first variable to real projects. Switch any time: your progress in each track is kept.
            </p>
            <div className="grid grid-cols-1 text-left md:grid-cols-2" style={{ gap: 18 }}>
              {TRACK_CARDS.map((t) => (
                <Link key={t.id} href="/lessons" className="dc-glass dc-depth-card dc-depth-card--interactive block" style={{ padding: "24px 26px" }}>
                  <div className="flex flex-wrap items-center justify-between" style={{ gap: 8 }}>
                    <h3 className="font-display" style={{ fontWeight: 800, fontSize: 24, margin: 0 }}>
                      {t.name}
                    </h3>
                    <span className={`dc-chip ${t.id === "csharp" ? "dc-chip--butter" : "dc-chip--mint"}`} style={{ fontSize: 11 }}>
                      {t.status}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dc-on-sky-soft)", lineHeight: 1.65, margin: "10px 0 14px" }}>{t.body}</p>
                  <div className="dc-code font-mono" style={{ padding: "13px 18px", fontSize: 13, lineHeight: 1.9 }}>
                    {t.code}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 13, fontWeight: 800, color: "var(--dc-link)" }}>
                    {getTrackLessons(t.id).length} lessons {"→"}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative" style={{ padding: "60px 20px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.07} pos={{ left: "-6%", top: "6%" }} width="min(340px, 27vw)" opacity={0.72} duration={14} scale={cs} />
          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 880 }}>
            <h2 className="dc-title glow-heading" style={{ fontSize: "clamp(30px, 4.4vw, 40px)" }}>
              The sky keeps score
            </h2>
            <p className="dc-lede" style={{ marginBottom: 36 }}>
              Streaks, XP and a sky of badges to collect, but every shiny thing is welded to a real skill. Nothing unlocks until you can actually do it.
            </p>
            <div className="flex flex-wrap justify-center" style={{ gap: 12, marginBottom: 34 }}>
              <span className="dc-chip dc-chip--glass dc-chip--lg">
                <StreakFlame /> Daily streaks
              </span>
              <span className="dc-chip dc-chip--glass dc-chip--lg">+XP for every win</span>
              <span className="dc-chip dc-chip--glass dc-chip--lg">{badges.length} badges to find</span>
            </div>
            <div className="flex items-end justify-center" style={{ gap: 6 }} aria-hidden="true">
              {[1, 2, 4, 5, 3].map((n, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={`/assets/clouds-neon/cutout-cloud-neon-1-0${n}.webp`}
                  alt=""
                  className="cloud-glow"
                  style={{ width: i === 2 ? 150 : "min(110px, 18vw)", height: "auto", animation: `floatySm ${6 + i}s ease-in-out ${i * 0.5}s infinite`, opacity: i === 0 || i === 4 ? 0.8 : 1 }}
                />
              ))}
            </div>
            <Link href="/badges" className="dc-btn dc-btn--light" style={{ marginTop: 26 }}>
              See the collection {"→"}
            </Link>
          </div>
        </section>

        <section className="relative text-center" style={{ padding: "70px 20px 90px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.05} pos={{ left: "-5%", top: "6%" }} width="min(380px, 30vw)" opacity={0.7} duration={15} scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-16.webp" speed={0.09} pos={{ right: "-6%", top: "18%" }} width="min(400px, 31vw)" opacity={0.7} duration={13} delay={1.1} scale={cs} />
          <div className="relative z-5">
            <div className="anim-neon-flicker">
              <h2 className="font-display neon-title" style={{ fontWeight: 800, fontSize: "min(56px, 9vw)", color: "#fff6fb", margin: 0 }}>
                Ready to dream in code?
              </h2>
            </div>
            <p className="dc-lede" style={{ marginTop: 16 }}>
              Free to start. No setup. The editor lives in your browser and the night is long.
            </p>
            <div className="flex flex-wrap justify-center" style={{ gap: 16, marginTop: 30 }}>
              <FinalStartCta />
              <Link href="/lessons" className="dc-btn dc-btn--secondary dc-btn--lg">
                Browse the lessons
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
