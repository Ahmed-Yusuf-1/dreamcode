import type { Metadata } from "next";
import PeaksView from "@/components/catalog/PeaksView";

export const metadata: Metadata = {
  title: "Problem Peaks",
  description: "Graded coding challenges for Python, JavaScript and TypeScript. Real tests, no rails.",
  alternates: { canonical: "/peaks" },
};

export default function PeaksPage() {
  return <PeaksView />;
}
