import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CodeTask from "@/components/code-task/CodeTask";
import { projects } from "@/lib/data";
import { getLesson } from "@/lib/curriculum";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return { title: "Project not found" };
  return { title: `${project.title} (${project.language} project)`, description: project.desc };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  const requires = project.requires ?? [];
  const names = requires.map((key) => getLesson(key)?.catalogTitle ?? projects.find((p) => p.id === key)?.title ?? key);
  const requiresLabel = names.length ? names.join(", ") : undefined;

  return (
    <CodeTask
      kind="project"
      id={project.id}
      title={project.title}
      language={project.language}
      levelLabel={`${project.tier} project`}
      xp={project.xp}
      instructions={project.instructions}
      packages={project.packages}
      starter={project.starter}
      functionName={project.functionName}
      testCases={project.testCases}
      steps={project.steps}
      hints={project.hints}
      back={{ href: "/projects", label: "Projects" }}
      onward={{ href: "/projects", label: "Back to projects →" }}
      requires={requires}
      requiresLabel={requiresLabel}
    />
  );
}
