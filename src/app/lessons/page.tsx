import type { Metadata } from "next";
import LessonsView from "@/components/catalog/LessonsView";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Every lesson in Python, JavaScript, TypeScript and C#, grouped into chapters from beginner to expert.",
  alternates: { canonical: "/lessons" },
};

export default function LessonsPage() {
  return <LessonsView />;
}
