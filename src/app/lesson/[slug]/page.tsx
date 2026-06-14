import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonView from "@/components/LessonView";
import { getLesson, getAllLessonSlugs, getAdjacent, lessons } from "@/lib/curriculum";

// Statically generate a page for every lesson in the curriculum.
export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found - dreamcode" };
  return { title: `${lesson.title} - dreamcode`, description: lesson.blurb };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const { next } = getAdjacent(slug);
  const count = lessons.filter((l) => (l.language || "python") === (lesson.language || "python")).length;
  return <LessonView lesson={lesson} total={count} next={next} />;
}
