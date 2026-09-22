import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CodeTask from "@/components/code-task/CodeTask";
import { challenges, moduleChallenges } from "@/lib/data";
import { getLesson, getModules } from "@/lib/curriculum";
import { trackFromLanguage } from "@/lib/catalog";

export function generateStaticParams() {
  return Object.keys(challenges).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const challenge = challenges[slug];
  if (!challenge) return { title: "Challenge not found" };
  return { title: `${challenge.name} (${challenge.language} challenge)`, description: challenge.blurb };
}

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = challenges[slug];
  if (!challenge) notFound();

  const moduleName = Object.entries(moduleChallenges).find(([, s]) => s === slug)?.[0];
  const modules = getModules(trackFromLanguage(challenge.language));
  const modIndex = moduleName ? modules.findIndex((m) => m.name === moduleName) : -1;

  let requires: string[] = [];
  let requiresLabel: string | undefined;
  let onward = { href: "/peaks", label: "More Problem Peaks →" };
  let back = { href: "/peaks", label: "Peaks" };

  if (modIndex >= 0) {
    const mod = modules[modIndex];
    requires = mod.lessons.map((l) => l.slug);
    requiresLabel = `the ${mod.name} chapter`;
    back = { href: "/journey", label: "Map" };
    const nextModule = modules[modIndex + 1];
    onward = nextModule
      ? { href: `/lesson/${nextModule.lessons[0].slug}`, label: `Next chapter: ${nextModule.name} →` }
      : { href: "/projects", label: "Build a project →" };
  } else if (challenge.requires) {
    const lesson = getLesson(challenge.requires);
    requires = [challenge.requires];
    requiresLabel = lesson ? `the ${lesson.catalogTitle} lesson` : undefined;
  }

  return (
    <CodeTask
      kind="challenge"
      id={challenge.slug}
      title={challenge.name}
      language={challenge.language}
      levelLabel={moduleName ? `Section challenge · ${challenge.level}` : challenge.level}
      xp={challenge.xp}
      instructions={challenge.instructions}
      packages={challenge.packages}
      starter={challenge.starter}
      functionName={challenge.functionName}
      testCases={challenge.testCases}
      hints={challenge.hints}
      back={back}
      onward={onward}
      requires={requires}
      requiresLabel={requiresLabel}
    />
  );
}
