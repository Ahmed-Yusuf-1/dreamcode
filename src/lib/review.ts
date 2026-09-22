/**
 * Night review cards. Every lesson contributes one recall card, built from the
 * strongest retrieval prompt it has: its predict-the-output problem, its first
 * quiz question, or (for lessons with neither) its key idea. Card ids are
 * `lesson:<slug>`, so a card's schedule survives content edits.
 *
 * This module reads full lesson content: use it on the server (the review page
 * builds the bank and hands it to the client).
 */
import { getTrackLessons, lessonTrack, moduleOf, TRACK_IDS, type Lesson } from "@/lib/curriculum";
import { practiceDatasets } from "@/lib/data";
import { optionOrder } from "@/lib/optionOrder";
import type { TrackId } from "@/content/types";

export interface ReviewCardData {
  id: string;
  lessonSlug: string;
  track: TrackId;
  module: string;
  concept: string;
  prompt: string;
  code?: string;
  /** Multiple-choice options, when the card is a quiz question. */
  options?: string[];
  answer: string;
  explain?: string;
  language: TrackId;
}

function plain(text: string) {
  return text.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

export function reviewCardId(lessonSlug: string) {
  return `lesson:${lessonSlug}`;
}

function cardFor(lesson: Lesson): ReviewCardData {
  const track = lessonTrack(lesson);
  const base = {
    id: reviewCardId(lesson.slug),
    lessonSlug: lesson.slug,
    track,
    module: moduleOf(lesson),
    concept: lesson.catalogTitle,
    language: track,
  };
  const practice = lesson.practiceSlug ? practiceDatasets[lesson.practiceSlug] : undefined;
  if (practice) {
    const correct = practice.predictOptions.find((o) => o.correct);
    if (correct) {
      return {
        ...base,
        prompt: practice.predictQuestion,
        code: practice.predictCode,
        answer: correct.label,
        explain: correct.why,
      };
    }
  }
  const q = lesson.quiz?.[0];
  if (q) {
    return {
      ...base,
      prompt: plain(q.prompt),
      // Same order the lesson shows, so the right answer is not always first.
      options: optionOrder(q.options.length, q.prompt + q.options.join("|")).map((i) => plain(q.options[i])),
      answer: plain(q.options[q.answer]),
      explain: q.explain,
    };
  }
  return {
    ...base,
    prompt: `What does this do, and when would you reach for it?`,
    code: lesson.catalogCode,
    answer: plain(lesson.blurb),
    explain: plain(lesson.tip),
  };
}

/** Every review card, all tracks. Filter on the client by completed lessons. */
export function buildReviewBank(): ReviewCardData[] {
  return TRACK_IDS.flatMap((track) => getTrackLessons(track).map(cardFor));
}
