import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PracticeFlow from "@/components/practice/PracticeFlow";
import { getAdjacent, getLesson, getModules, lessonTrack, moduleOf } from "@/lib/curriculum";
import { getModuleChallenge, practiceDatasets } from "@/lib/data";

export function generateStaticParams() {
  return Object.keys(practiceDatasets).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return { title: lesson ? `Practice: ${lesson.catalogTitle}` : "Practice", robots: { index: false } };
}

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = practiceDatasets[slug];
  const lesson = getLesson(slug);
  if (!data || !lesson) notFound();

  const track = lessonTrack(lesson);
  const moduleName = moduleOf(lesson);
  const modules = getModules(track);
  const mod = modules.find((m) => m.name === moduleName);
  const isLastOfModule = mod?.lessons[mod.lessons.length - 1]?.slug === lesson.slug;
  const { next } = getAdjacent(lesson.slug);
  const sectionChallenge = isLastOfModule ? getModuleChallenge(moduleName) : null;

  return (
    <PracticeFlow
      slug={slug}
      data={data}
      lesson={{ slug: lesson.slug, title: lesson.title, catalogTitle: lesson.catalogTitle, language: track }}
      next={next}
      chapterEnd={isLastOfModule}
      sectionChallenge={sectionChallenge ? { slug: sectionChallenge.slug, name: sectionChallenge.name } : null}
    />
  );
}
