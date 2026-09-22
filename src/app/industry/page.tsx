import type { Metadata } from "next";
import IndustryView from "@/components/catalog/IndustryView";

export const metadata: Metadata = {
  title: "Where these languages are used",
  description: "Real jobs, tools and products built with Python, JavaScript, TypeScript and C#.",
  alternates: { canonical: "/industry" },
};

export default function IndustryPage() {
  return <IndustryView />;
}
