import type { Metadata } from "next";
import ProjectsView from "@/components/catalog/ProjectsView";

export const metadata: Metadata = {
  title: "Projects",
  description: "Guided, independent and capstone projects that put a whole chapter of skills to work.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
