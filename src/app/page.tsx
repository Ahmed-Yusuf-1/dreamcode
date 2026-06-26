import Link from "next/link";
import Cloud from "@/components/Cloud";
import StreakFlame from "@/components/StreakFlame";
import Wordmark from "@/components/Wordmark";
import { HeroStartCta, FinalStartCta, ContinueCard } from "@/components/JourneyCtas";
import { gradientOpacity, cloudOpacity } from "@/lib/theme";

// One continuous gradient for everything below the hero, so the sections read
// as a single sky instead of stitched bands. It holds the hero's bottom colour
// (#191643) at the very top and bottom so the seams disappear.
const STORY_GRADIENT =
  "linear-gradient(180deg, #463f80 0%, #463f80 5%, #564a92 16%, #6e5fae 38%, #8E95CE 58%, #b58fc6 72%, #c79fce 82%, #e1a6c4 92%, #F0AABE 100%)";

const cs = cloudOpacity.home;

export default function Home() {
  return (
    <div style={{ background: "#463f80", overflowX: "clip" }}>
      {/* ============ HERO - NEON DUSK ============ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "max(100vh, 880px)", background: "#4c4096" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/backgrounds/bg-dusk-neon-clouds-1.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 40%" }}
        />

        {/* sunset cutouts (under the gradient) */}
        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.1} pos={{ left: "-5%", top: "30%" }} width="min(440px, 34vw)" opacity={0.88} duration={13} />
        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.16} pos={{ right: "-4%", top: "16%" }} width="min(380px, 29vw)" opacity={0.82} duration={10} delay={1.3} />
        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp" speed={0.22} pos={{ left: "16%", top: "6%" }} width="250px" opacity={0.7} anim="floatySm" duration={8} delay={0.6} />
        <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-16.webp" speed={0.07} pos={{ right: "8%", bottom: "12%" }} width="min(420px, 31vw)" opacity={0.78} duration={15} delay={0.9} />

        {/* gradient overlays */}
        <div
          className="pointer-events-none absolute inset-0 z-2"
          style={{ background: "linear-gradient(180deg, #6E8FC7 0%, #F0AABE 100%)", opacity: gradientOpacity.home }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(34,32,82,.2) 0%, rgba(34,32,82,0) 28%, rgba(54,48,104,0) 50%, rgba(62,56,118,.5) 76%, rgba(70,63,128,.88) 90%, rgba(70,63,128,1) 100%)",
          }}
        />

        {/* hero */}
        <div className="relative z-5 text-center" style={{ padding: "16vh 24px 0" }}>
          <div className="anim-neon-flicker">
            <h1
              className="font-display neon-title"
              style={{ fontWeight: 800, fontSize: "min(100px, 11vw)", lineHeight: 1, color: "#fff6fb" }}
            >
              dreamcode
            </h1>
          </div>
          <div
            className="neon-outline inline-block backdrop-blur-xs"
            style={{
              marginTop: 24,
              padding: "9px 26px",
              borderRadius: 999,
              color: "#eefcff",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 6,
            }}
          >
            LEARN · SOLVE · DREAM
          </div>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.65,
              color: "#ffffff",
              fontWeight: 700,
              maxWidth: 520,
              margin: "26px auto 0",
              textShadow: "0 2px 18px rgba(20,16,50,.75)",
              textWrap: "pretty",
            }}
          >
            Tiny lessons and glowing problems, served all night. Python, JavaScript, C#, and
            TypeScript, one neon mile at a time.
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: 14, marginTop: 34 }}>
            <HeroStartCta />
            <Link
              href="/challenge/cloud-hopper"
              className="font-display cursor-pointer backdrop-blur-sm transition-colors hover:bg-[rgba(110,230,255,.22)]"
              style={{
                background: "rgba(24,22,60,.35)",
                border: "2px solid rgba(150,245,255,.85)",
                color: "#eefcff",
                fontWeight: 700,
                fontSize: 17,
                padding: "14px 28px",
                borderRadius: 999,
                boxShadow: "0 0 18px rgba(110,230,255,.4)",
              }}
            >
              Try a problem
            </Link>
          </div>
        </div>

        {/* floating progress chips */}
        <div
          className="dc-side-float absolute z-6 flex items-center backdrop-blur-md"
          style={{
            left: "6%",
            top: "42%",
            animation: "floaty 7s ease-in-out infinite",
            gap: 8,
            background: "rgba(255,255,255,.16)",
            border: "1px solid rgba(255,255,255,.5)",
            borderRadius: 999,
            padding: "10px 18px",
            boxShadow: "0 0 20px rgba(255,150,220,.3)",
          }}
        >
          <StreakFlame />
          <span style={{ fontWeight: 900, fontSize: 14, color: "#ffffff", textShadow: "0 1px 8px rgba(20,16,50,.6)" }}>
            7-day streak
          </span>
        </div>
        <div
          className="dc-side-float absolute z-6 flex items-center backdrop-blur-md"
          style={{
            right: "7%",
            top: "48%",
            animation: "floaty 9s ease-in-out 1.2s infinite",
            gap: 8,
            background: "rgba(255,255,255,.16)",
            border: "1px solid rgba(150,245,255,.6)",
            borderRadius: 999,
            padding: "10px 18px",
            boxShadow: "0 0 20px rgba(110,230,255,.3)",
          }}
        >
          <span style={{ fontWeight: 900, fontSize: 14, color: "#eefcff", textShadow: "0 0 10px rgba(110,230,255,.8)" }}>
            +15 XP tonight
          </span>
        </div>
        <ContinueCard />

        {/* stats anchored over the dark field */}
        <div className="absolute z-5 flex justify-center" style={{ left: 0, right: 0, bottom: 88, gap: 38 }}>
          {[
            ["100+", "bite-size lessons"],
            ["70+", "practice sets"],
            ["10", "cloud badges to earn"],
          ].map(([num, label], i) => (
            <div key={label} className="flex" style={{ gap: 38 }}>
              {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,.35)" }} />}
              <div className="text-center">
                <div
                  className="font-display"
                  style={{ fontWeight: 800, fontSize: 30, color: "#ffffff", textShadow: "0 0 16px rgba(255,170,220,.9)" }}
                >
                  {num}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,248,252,.92)" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="absolute z-5 text-center"
          style={{ left: 0, right: 0, bottom: 54, fontSize: 13, fontWeight: 800, color: "rgba(255,250,255,.75)" }}
        >
          Free to start · No setup, the editor lives in your browser ↓
        </div>
      </section>

      {/* ============ THE STORY - one continuous sky ============ */}
      <div className="relative" style={{ background: STORY_GRADIENT }}>
        {/* WHY DREAMCODE */}
        <section className="relative" style={{ padding: "90px 28px 60px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-13.webp" speed={0.06} pos={{ right: "-6%", top: "8%" }} width="min(420px, 32vw)" opacity={0.75} duration={14} neon="cyan" scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-02.webp" speed={0.12} pos={{ left: "-4%", bottom: "-6%" }} width="min(340px, 27vw)" opacity={0.7} duration={11} delay={1.2} scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp" speed={0.18} pos={{ left: "44%", top: "2%" }} width="170px" opacity={0.55} anim="floatySm" duration={9} delay={0.5} scale={cs} />

          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 1020 }}>
            <div
              className="neon-outline inline-block"
              style={{ padding: "7px 20px", borderRadius: 999, color: "#eefcff", fontWeight: 900, fontSize: 12, letterSpacing: 3 }}
            >
              WHY IT WORKS
            </div>
            <h2 className="font-display glow-heading" style={{ fontWeight: 800, fontSize: 42, color: "#ffffff", margin: "18px 0 12px" }}>
              Most tutorials watch you copy.
              <br />
              Here, you fly solo from line one.
            </h2>
            <p style={{ fontSize: 16.5, fontWeight: 700, color: "rgba(255,255,255,.85)", maxWidth: 560, margin: "0 auto 46px", lineHeight: 1.7, textWrap: "pretty" }}>
              Tutorial hell is real - you finish ten courses and still freeze at an empty editor.
              dreamcode is built backwards from that problem.
            </p>

            <div className="grid grid-cols-1 text-left md:grid-cols-3" style={{ gap: 18 }}>
              {[
                {
                  img: "/assets/clouds-neon/cutout-cloud-neon-1-01.webp",
                  glow: "cloud-neon-magenta",
                  title: "You write every line",
                  body: "No passive videos. Every concept becomes your code within seconds - predict it, arrange it, then build it from scratch.",
                  accent: "#ffd9ef",
                },
                {
                  img: "/assets/clouds-neon/cutout-cloud-neon-1-05.webp",
                  glow: "cloud-neon-cyan",
                  title: "Your memory does laps",
                  body: "Concepts drift back as night reviews, timed right before you'd forget. Two minutes a day keeps weeks of learning yours.",
                  accent: "#cdeaff",
                },
                {
                  img: "/assets/clouds-neon/cutout-cloud-neon-1-02.webp",
                  glow: "cloud-glow",
                  title: "Stuck is a feature",
                  body: "The Dream Guide asks the question that unsticks you - it never pastes the answer. The breakthrough stays yours.",
                  accent: "#d9c9ff",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="glass glow-hover"
                  style={{ borderRadius: 22, padding: "26px 26px", boxShadow: "0 18px 44px rgba(10,8,40,.35)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.title} className={c.glow} style={{ width: 92, height: "auto", animation: "floatySm 7s ease-in-out infinite" }} />
                  <div
                    className="font-display"
                    style={{ fontWeight: 800, fontSize: 21, color: "#ffffff", margin: "12px 0 8px", textShadow: `0 0 14px ${c.accent}` }}
                  >
                    {c.title}
                  </div>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: "rgba(255,255,255,.9)", lineHeight: 1.65, margin: 0 }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW A NIGHT FLOWS */}
        <section className="relative" style={{ padding: "60px 28px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-10.webp" speed={0.05} pos={{ left: "-8%", top: "10%" }} width="min(480px, 36vw)" opacity={0.7} duration={16} scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-14.webp" speed={0.13} pos={{ right: "-5%", bottom: "-8%" }} width="min(320px, 26vw)" opacity={0.62} duration={12} delay={0.9} neon="magenta" scale={cs} />

          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 980 }}>
            <h2 className="font-display glow-heading" style={{ fontWeight: 800, fontSize: 40, color: "#ffffff", margin: "0 0 10px" }}>
              How a night flows
            </h2>
            <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.85)", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.65 }}>
              Four small moves, over and over, until the language is simply yours.
            </p>

            <div className="grid grid-cols-1 text-left sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16 }}>
              {[
                { n: "01", name: "Learn", body: "A short, glowing idea with a worked example you can poke at.", color: "rgba(255,138,222,.9)" },
                { n: "02", name: "Practice", body: "Predict outputs, arrange the pieces, fill the fading blanks.", color: "rgba(150,245,255,.9)" },
                { n: "03", name: "Apply", body: "Climb a Problem Peak - just a prompt, tests and your plan.", color: "rgba(255,228,154,.9)" },
                { n: "04", name: "Review", body: "Days later it drifts back. You catch it. Now it sticks.", color: "rgba(189,160,255,.9)" },
              ].map((s, i) => (
                <div key={s.n} className="glass" style={{ borderRadius: 20, padding: "22px 22px", boxShadow: "0 16px 40px rgba(10,8,40,.3)" }}>
                  <div
                    className="font-display"
                    style={{ fontWeight: 800, fontSize: 30, color: s.color, textShadow: `0 0 18px ${s.color}` }}
                  >
                    {s.n}
                  </div>
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 20, color: "#ffffff", margin: "6px 0 6px" }}>
                    {s.name}
                    {i < 3 && <span style={{ color: "rgba(255,255,255,.5)", marginLeft: 8 }}>{"\u2192"}</span>}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.88)", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TWO LANGUAGES */}
        <section className="relative" style={{ padding: "60px 28px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-15.webp" speed={0.08} pos={{ right: "-4%", top: "10%" }} width="min(360px, 28vw)" opacity={0.75} duration={12} delay={0.8} neon="magenta" scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-11.webp" speed={0.14} pos={{ left: "-6%", bottom: "-10%" }} width="min(320px, 26vw)" opacity={0.6} duration={13} delay={1.1} scale={cs} />

          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 920 }}>
            <h2 className="font-display glow-heading" style={{ fontWeight: 800, fontSize: 40, color: "#ffffff", margin: "0 0 10px" }}>
              Four languages, one road
            </h2>
            <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.85)", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.65 }}>
              Four guided tracks on one road. Python, JavaScript and TypeScript run right in your
              browser; C# is a read and quiz track. From your first variable to real projects.
            </p>

            <div className="grid grid-cols-1 text-left md:grid-cols-2" style={{ gap: 18 }}>
              <div className="glass glow-hover" style={{ borderRadius: 22, padding: "26px 28px", boxShadow: "0 18px 44px rgba(10,8,40,.35)" }}>
                <div className="flex items-center justify-between">
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 24, color: "#ffffff" }}>
                    Python
                  </div>
                  <span style={{ background: "#d9f5e6", color: "#0f5c38", fontWeight: 900, fontSize: 11, padding: "5px 12px", borderRadius: 999 }}>
                    AVAILABLE NOW
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.9)", lineHeight: 1.65, margin: "10px 0 16px" }}>
                  Variables to loops to your first real project - the friendliest road into
                  programming, paved one stop at a time.
                </p>
                <div className="font-mono" style={{ background: "rgba(8,18,46,.8)", borderRadius: 14, padding: "14px 18px", fontSize: 13, lineHeight: 1.9 }}>
                  <div>
                    <span style={{ color: "#ff9ecf" }}>for</span> <span style={{ color: "#dbe9ff" }}>star</span>{" "}
                    <span style={{ color: "#ff9ecf" }}>in</span> <span style={{ color: "#dbe9ff" }}>night_sky:</span>
                  </div>
                  <div>
                    <span style={{ color: "#dbe9ff" }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span style={{ color: "#9ad1ff" }}>wish</span>
                    <span style={{ color: "#dbe9ff" }}>(star)</span>
                  </div>
                </div>
              </div>

              <div className="glass glow-hover" style={{ borderRadius: 22, padding: "26px 28px", boxShadow: "0 18px 44px rgba(10,8,40,.35)" }}>
                <div className="flex items-center justify-between">
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 24, color: "#ffffff" }}>
                    JavaScript
                  </div>
                  <span style={{ background: "#d9f5e6", color: "#0f5c38", fontWeight: 900, fontSize: 11, padding: "5px 12px", borderRadius: 999 }}>
                    AVAILABLE NOW
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.9)", lineHeight: 1.65, margin: "10px 0 16px" }}>
                  The language the web dreams in. A full guided track, from your first function to
                  closures, async, and the DOM.
                </p>
                <div className="font-mono" style={{ background: "rgba(8,18,46,.8)", borderRadius: 14, padding: "14px 18px", fontSize: 13, lineHeight: 1.9 }}>
                  <div>
                    <span style={{ color: "#dbe9ff" }}>clouds.</span>
                    <span style={{ color: "#9ad1ff" }}>filter</span>
                    <span style={{ color: "#dbe9ff" }}>(c </span>
                    <span style={{ color: "#ff9ecf" }}>=&gt;</span>
                    <span style={{ color: "#dbe9ff" }}> c.glows)</span>
                  </div>
                  <div>
                    <span style={{ color: "#dbe9ff" }}>&nbsp;&nbsp;.</span>
                    <span style={{ color: "#9ad1ff" }}>map</span>
                    <span style={{ color: "#dbe9ff" }}>(</span>
                    <span style={{ color: "#9ad1ff" }}>hop</span>
                    <span style={{ color: "#dbe9ff" }}>)</span>
                  </div>
                </div>
              </div>

              <div className="glass glow-hover" style={{ borderRadius: 22, padding: "26px 28px", boxShadow: "0 18px 44px rgba(10,8,40,.35)" }}>
                <div className="flex items-center justify-between">
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 24, color: "#ffffff" }}>
                    TypeScript
                  </div>
                  <span style={{ background: "#d9f5e6", color: "#0f5c38", fontWeight: 900, fontSize: 11, padding: "5px 12px", borderRadius: 999 }}>
                    AVAILABLE NOW
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.9)", lineHeight: 1.65, margin: "10px 0 16px" }}>
                  JavaScript with a type safety net. Real type checking in the editor catches
                  mistakes before your code ever runs.
                </p>
                <div className="font-mono" style={{ background: "rgba(8,18,46,.8)", borderRadius: 14, padding: "14px 18px", fontSize: 13, lineHeight: 1.9 }}>
                  <div>
                    <span style={{ color: "#ff9ecf" }}>let</span>
                    <span style={{ color: "#dbe9ff" }}> stars</span>
                    <span style={{ color: "#ff9ecf" }}>:</span>
                    <span style={{ color: "#9ad1ff" }}> number</span>
                    <span style={{ color: "#dbe9ff" }}> = </span>
                    <span style={{ color: "#ffd9a0" }}>100</span>
                    <span style={{ color: "#dbe9ff" }}>;</span>
                  </div>
                </div>
              </div>

              <div className="glass glow-hover" style={{ borderRadius: 22, padding: "26px 28px", boxShadow: "0 18px 44px rgba(10,8,40,.35)" }}>
                <div className="flex items-center justify-between">
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 24, color: "#ffffff" }}>
                    C#
                  </div>
                  <span style={{ background: "#fff3c9", color: "#7a5410", fontWeight: 900, fontSize: 11, padding: "5px 12px", borderRadius: 999 }}>
                    READ + QUIZ
                  </span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.9)", lineHeight: 1.65, margin: "10px 0 16px" }}>
                  Typed and everywhere, from games to enterprise. Learn the .NET essentials through
                  worked examples and quizzes, with runnable code on the way.
                </p>
                <div className="font-mono" style={{ background: "rgba(8,18,46,.8)", borderRadius: 14, padding: "14px 18px", fontSize: 13, lineHeight: 1.9 }}>
                  <div>
                    <span style={{ color: "#9ad1ff" }}>Console</span>
                    <span style={{ color: "#dbe9ff" }}>.</span>
                    <span style={{ color: "#9ad1ff" }}>WriteLine</span>
                    <span style={{ color: "#dbe9ff" }}>(</span>
                    <span style={{ color: "#ffd9a0" }}>&quot;hello, sky&quot;</span>
                    <span style={{ color: "#dbe9ff" }}>);</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EARN THE SKY */}
        <section className="relative" style={{ padding: "60px 28px" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-1-04.webp" speed={0.11} pos={{ right: "-5%", bottom: "2%" }} width="min(360px, 28vw)" opacity={0.78} duration={11} delay={1.4} scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-12.webp" speed={0.07} pos={{ left: "-6%", top: "6%" }} width="min(340px, 27vw)" opacity={0.72} duration={14} scale={cs} />

          <div className="relative z-5 mx-auto text-center" style={{ maxWidth: 880 }}>
            <h2 className="font-display glow-heading" style={{ fontWeight: 800, fontSize: 40, color: "#ffffff", margin: "0 0 10px" }}>
              The sky keeps score
            </h2>
            <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,.88)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.65 }}>
              Streaks, XP and a sky of neon clouds to collect - but every shiny thing is welded to a real
              skill. Nothing unlocks until you can actually do it.
            </p>

            <div className="flex flex-wrap justify-center" style={{ gap: 14, marginBottom: 36 }}>
              <div className="glass flex items-center" style={{ gap: 9, borderRadius: 999, padding: "12px 22px", boxShadow: "0 0 22px rgba(255,170,120,.3)" }}>
                <StreakFlame />
                <span style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>Daily streaks</span>
              </div>
              <div className="glass flex items-center" style={{ gap: 9, borderRadius: 999, padding: "12px 22px", boxShadow: "0 0 22px rgba(255,228,154,.35)" }}>
                <span style={{ fontWeight: 900, fontSize: 15, color: "#fff3c9", textShadow: "0 0 10px rgba(255,228,154,.8)" }}>+XP</span>
                <span style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>for every win</span>
              </div>
              <div className="glass flex items-center" style={{ gap: 9, borderRadius: 999, padding: "12px 22px", boxShadow: "0 0 22px rgba(189,160,255,.4)" }}>
                <span style={{ fontWeight: 900, fontSize: 15, color: "#e6d9ff", textShadow: "0 0 10px rgba(189,160,255,.8)" }}>10</span>
                <span style={{ fontWeight: 900, fontSize: 15, color: "#ffffff" }}>badges to find</span>
              </div>
            </div>

            <div className="flex items-end justify-center" style={{ gap: 6 }}>
              {[1, 2, 4, 5, 3].map((n, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={`/assets/clouds-neon/cutout-cloud-neon-1-0${n}.webp`}
                  alt=""
                  className={i === 2 ? "cloud-neon-magenta" : i === 1 || i === 3 ? "cloud-neon-cyan" : "cloud-glow"}
                  style={{
                    width: i === 2 ? 150 : 110,
                    height: "auto",
                    animation: `floatySm ${6 + i}s ease-in-out ${i * 0.5}s infinite`,
                    opacity: i === 0 || i === 4 ? 0.8 : 1,
                  }}
                />
              ))}
            </div>
            <Link
              href="/badges"
              className="font-display inline-block cursor-pointer transition-transform hover:-translate-y-0.5"
              style={{
                marginTop: 24,
                background: "rgba(255,255,255,.92)",
                color: "#5b3f78",
                fontWeight: 800,
                fontSize: 16,
                padding: "13px 28px",
                borderRadius: 999,
                boxShadow: "0 0 24px rgba(255,255,255,.45), 0 14px 32px rgba(40,30,80,.35)",
              }}
            >
              See the collection {"\u2192"}
            </Link>
          </div>
        </section>

        {/* FINAL CTA + FOOTER */}
        <section className="relative text-center" style={{ padding: "70px 28px 0" }}>
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-09.webp" speed={0.05} pos={{ left: "-5%", top: "6%" }} width="min(380px, 30vw)" opacity={0.7} duration={15} scale={cs} />
          <Cloud src="/assets/clouds-sunset/cutout-cloud-sunset-16.webp" speed={0.09} pos={{ right: "-6%", top: "18%" }} width="min(400px, 31vw)" opacity={0.7} duration={13} delay={1.1} neon="cyan" scale={cs} />

          <div className="relative z-5">
            <div className="anim-neon-flicker">
              <h2 className="font-display neon-title" style={{ fontWeight: 800, fontSize: "min(56px, 8vw)", color: "#fff6fb", margin: 0 }}>
                Ready to dream in code?
              </h2>
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,.88)", margin: "16px auto 0", maxWidth: 460, lineHeight: 1.65 }}>
              Free to start. No setup. The editor lives in your browser and the night is long.
            </p>
            <div className="flex flex-wrap justify-center" style={{ gap: 14, marginTop: 30 }}>
              <FinalStartCta />
              <Link
                href="/lessons"
                className="font-display cursor-pointer backdrop-blur-sm transition-colors hover:bg-[rgba(110,230,255,.22)]"
                style={{
                  background: "rgba(24,22,60,.35)",
                  border: "2px solid rgba(150,245,255,.85)",
                  color: "#eefcff",
                  fontWeight: 700,
                  fontSize: 17,
                  padding: "14px 30px",
                  borderRadius: 999,
                  boxShadow: "0 0 18px rgba(110,230,255,.4)",
                }}
              >
                Browse the lessons
              </Link>
            </div>

            {/* footer */}
            <div
              className="relative z-5 mx-auto flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:gap-5 sm:text-left"
              style={{
                width: "100%",
                maxWidth: 1100,
                marginTop: 90,
                padding: "26px clamp(16px, 4vw, 32px) 34px",
                borderTop: "1px solid rgba(255,255,255,.18)",
              }}
            >
              <Wordmark size="sm" />
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,.7)", textWrap: "pretty" }}>
                Everywhere you can go now lives in the{" "}
                <span style={{ color: "#ffd9ef", fontWeight: 800 }}>Explore</span> menu, up top.
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>
                © 2026 dreamcode · made above the clouds
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
