import type { Metadata } from "next";
import ReviewSession from "@/components/review/ReviewSession";
import { buildReviewBank } from "@/lib/review";
import { getLesson, moduleOf } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Night review",
  description: "Spaced recall of everything you have learned, scheduled right before you would forget it.",
  robots: { index: false },
};

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ lesson?: string | string[] }> }) {
  const { lesson } = await searchParams;
  const chapterLesson = typeof lesson === "string" ? getLesson(lesson) : null;
  return (
    <ReviewSession
      bank={buildReviewBank()}
      chapter={chapterLesson ? { module: moduleOf(chapterLesson), fromLesson: chapterLesson.slug } : null}
    />
  );
}
