import type { Metadata } from "next";
import JourneyView from "@/components/journey/JourneyView";

export const metadata: Metadata = {
  title: "Journey map",
  description: "Your road through every chapter: lessons, section challenges and the project waiting at the top.",
  alternates: { canonical: "/journey" },
};

export default function JourneyPage() {
  return <JourneyView />;
}
