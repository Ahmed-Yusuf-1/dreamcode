import { getModules } from "@/lib/curriculum";
import type { ReviewCard } from "@/lib/data";
import type { Track } from "@/lib/track";

function plain(text: string) {
  return text.replace(/\*\*/g, "").trim();
}

/** Builds one recall card for every lesson the learner has actually completed. */
export function getReviewCards(track: Track, completedStops: string[]): ReviewCard[] {
  const completed = new Set(completedStops);
  return getModules(track)
    .flatMap((module) => module.lessons)
    .filter((lesson) => completed.has(lesson.slug))
    .map((lesson) => ({
      id: `lesson:${lesson.slug}`,
      concept: lesson.catalogTitle,
      prompt: `Without reopening the lesson, explain the main idea behind “${lesson.catalogTitle}”.`,
      answer: `${plain(lesson.intro)} ${plain(lesson.tip)}`,
      code: lesson.catalogCode || lesson.example,
      language: lesson.language || "python",
      due: "due now",
    }));
}
