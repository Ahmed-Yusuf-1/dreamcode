"use client";

import { useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import FlowBar from "@/components/ui/FlowBar";
import TrackPicker from "@/components/ui/TrackPicker";
import RichText from "@/components/ui/RichText";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { useActiveTrack } from "@/lib/track";
import { completeActivity } from "@/lib/profile";
import { playChime } from "@/lib/sound";
import { track as telemetry } from "@/lib/telemetry";
import { savePlacement } from "@/lib/placement";
import { optionOrder } from "@/lib/optionOrder";
import { getLessonMeta, getTrackModules, trackLabel, type TrackId } from "@/lib/catalog";
import type { PlacementQuestion } from "@/content/placement";

const NOT_SURE = -1;

export default function PlacementFlow({ banks }: { banks: Record<TrackId, PlacementQuestion[]> }) {
  const catalog = useCatalog();
  const { track } = useActiveTrack();
  const [step, setStep] = useState<"welcome" | "quiz" | "result">("welcome");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [misses, setMisses] = useState<number[]>([]);
  const [streakMiss, setStreakMiss] = useState(0);
  const [recommended, setRecommended] = useState<string | null>(null);
  const [earned, setEarned] = useState(0);

  const questions = banks[track] ?? [];
  const q = questions[index];
  const modules = getTrackModules(catalog, track);
  const lessons = modules.flatMap((m) => m.lessons);

  const finish = (missIndexes: number[], answeredCount: number) => {
    let slug: string;
    if (missIndexes.length > 0) {
      slug = questions[missIndexes[0]].lesson;
    } else {
      // Everything answered was right: start just after the last lesson tested.
      const last = questions[answeredCount - 1]?.lesson;
      const i = lessons.findIndex((l) => l.slug === last);
      slug = lessons[Math.min(lessons.length - 1, i + 1)]?.slug ?? lessons[0].slug;
    }
    if (!getLessonMeta(catalog, slug)) slug = lessons[0].slug;
    savePlacement(track, slug);
    setRecommended(slug);
    const result = completeActivity(`placement:${track}`);
    setEarned(result.xp);
    telemetry("placement_completed", { track, recommended: slug, correct: answeredCount - missIndexes.length, answered: answeredCount });
    playChime("success");
    setStep("result");
  };

  const next = () => {
    if (picked === null) return;
    const wrong = picked !== q.answer;
    const newMisses = wrong ? [...misses, index] : misses;
    const newStreak = wrong ? streakMiss + 1 : 0;
    setMisses(newMisses);
    setStreakMiss(newStreak);
    setPicked(null);
    if (newStreak >= 2 || index === questions.length - 1) {
      finish(newMisses, index + 1);
    } else {
      setIndex(index + 1);
    }
  };

  const restart = () => {
    setStep("welcome");
    setIndex(0);
    setPicked(null);
    setMisses([]);
    setStreakMiss(0);
    setRecommended(null);
  };

  const rec = recommended ? getLessonMeta(catalog, recommended) : null;
  const recModule = rec ? modules.find((m) => m.name === rec.module) : null;

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.practice}>
      <FlowBar
        back={{ href: "/dashboard", label: "Dashboard" }}
        title={`Placement check · ${trackLabel(track)}`}
        right={step === "quiz" ? <span className="dc-chip dc-chip--glass">Question {index + 1} of up to {questions.length}</span> : <span className="dc-chip dc-chip--butter">+50 XP once</span>}
      />
      <div className="dc-container" style={{ maxWidth: 640, paddingTop: "6vh", paddingBottom: 90 }}>
        {step === "welcome" && (
          <section className="dc-paper anim-pop-in text-center" style={{ padding: "34px 30px" }}>
            <h1 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 30, margin: 0 }}>
              Find your starting stop
            </h1>
            <p className="dc-prose" style={{ margin: "12px 0 20px" }}>
              A few quick questions, easiest first. It stops as soon as you reach new ground and suggests where to begin. Nothing gets skipped or marked done for you, and you can always start from lesson 1.
            </p>
            <div className="flex justify-center" style={{ marginBottom: 22 }}>
              <TrackPicker />
            </div>
            <button type="button" className="dc-btn dc-btn--primary" onClick={() => setStep("quiz")}>
              Start the check {"→"}
            </button>
          </section>
        )}

        {step === "quiz" && q && (
          <section key={index} className="dc-paper anim-pop-in" style={{ padding: "30px 28px" }}>
            <span className="dc-chip dc-chip--lavender">{getLessonMeta(catalog, q.lesson)?.module ?? "Question"}</span>
            <h1 className="font-display dc-ink" style={{ fontWeight: 800, fontSize: 22, lineHeight: 1.3, margin: "14px 0 14px" }}>
              <RichText text={q.prompt} />
            </h1>
            {q.code && (
              <pre className="dc-code" style={{ padding: "14px 18px", fontSize: 13.5, lineHeight: 1.8, margin: "0 0 16px", whiteSpace: "pre-wrap", overflowX: "auto" }}>
                {q.code}
              </pre>
            )}
            <div className="flex flex-col" role="radiogroup" aria-label="Your answer" style={{ gap: 9 }}>
              {optionOrder(q.options.length, q.prompt + (q.code ?? "")).map((i) => (
                <button key={i} type="button" role="radio" aria-checked={picked === i} className="dc-option" data-state={picked === i ? "reveal" : undefined} onClick={() => setPicked(i)}>
                  <span className={q.code ? "font-mono" : undefined} style={{ whiteSpace: "pre-line" }}>
                    <RichText text={q.options[i]} />
                  </span>
                </button>
              ))}
              <button type="button" role="radio" aria-checked={picked === NOT_SURE} className="dc-option" data-state={picked === NOT_SURE ? "reveal" : undefined} onClick={() => setPicked(NOT_SURE)}>
                I have not learned this yet
              </button>
            </div>
            <div className="flex justify-end" style={{ marginTop: 20 }}>
              <button type="button" className="dc-btn dc-btn--primary" disabled={picked === null} onClick={next}>
                {index === questions.length - 1 ? "See my result" : "Next →"}
              </button>
            </div>
          </section>
        )}

        {step === "result" && rec && (
          <section className="anim-pop-in text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/clouds-neon/cutout-cloud-neon-1-02.webp" alt="" className="cloud-glow" style={{ display: "block", width: 160, height: "auto", margin: "0 auto", animation: "floatySm 5s ease-in-out infinite" }} />
            <h1 className="dc-title neon-title" style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 16 }}>
              Start at {rec.catalogTitle}
            </h1>
            <p className="dc-lede">
              {misses.length === 0
                ? "You knew everything we asked. Here is the next stop after it."
                : `Chapter ${recModule?.chapter ?? 1}, ${rec.module}. That is where the new ideas begin for you.`}{" "}
              Earlier lessons stay open if you want a refresher.
            </p>
            <div className="dc-chip dc-chip--butter dc-chip--lg" style={{ marginTop: 14 }}>
              {earned > 0 ? `+${earned} XP for the check` : "Placement XP already earned"}
            </div>
            <div className="flex flex-wrap justify-center" style={{ gap: 14, marginTop: 26 }}>
              <Link href={`/lesson/${rec.slug}`} className="dc-btn dc-btn--primary">
                Start there {"→"}
              </Link>
              <Link href={`/lesson/${lessons[0].slug}`} className="dc-btn dc-btn--secondary">
                Start from lesson 1
              </Link>
            </div>
            <button type="button" onClick={restart} className="dc-pill" style={{ marginTop: 22 }}>
              Take it again
            </button>
          </section>
        )}
      </div>
    </Scene>
  );
}
