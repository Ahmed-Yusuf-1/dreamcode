import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonView from "@/components/LessonView";
import { getAdjacent, getAllLessonSlugs, getLesson, getModules, lessonTrack, moduleOf } from "@/lib/curriculum";
import { getModuleChallenge, practiceDatasets } from "@/lib/data";

// Statically generate a page for every lesson in the curriculum.
export function generateStaticParams() {
  return getAllLessonSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson not found" };
  return {
    title: lesson.title,
    description: lesson.blurb,
    alternates: { canonical: `/lesson/${slug}` },
  };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const modules = getModules(lessonTrack(lesson));
  const trackLessons = modules.flatMap((m) => m.lessons);
  const moduleName = moduleOf(lesson);
  const chapterIndex = modules.findIndex((m) => m.name === moduleName);
  const mod = modules[chapterIndex];
  const isLastOfModule = mod?.lessons[mod.lessons.length - 1]?.slug === lesson.slug;
  const challenge = lesson.runnable !== false && isLastOfModule ? getModuleChallenge(moduleName) : null;
  const { next } = getAdjacent(slug);

  return (
    <LessonView
      lesson={lesson}
      position={{
        index: trackLessons.findIndex((l) => l.slug === slug) + 1,
        total: trackLessons.length,
        chapter: chapterIndex + 1,
        moduleName,
      }}
      next={next}
      sectionChallenge={challenge ? { slug: challenge.slug, name: challenge.name, level: challenge.level } : null}
      hasPractice={!!(lesson.practiceSlug && practiceDatasets[lesson.practiceSlug])}
    />
  );
}
