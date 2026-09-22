import type { Metadata } from "next";
import PlacementFlow from "@/components/placement/PlacementFlow";
import { placementBanks } from "@/content/placement";

export const metadata: Metadata = {
  title: "Placement check",
  description: "A two-minute check that finds the right first lesson for you in any track.",
};

export default function PlacementPage() {
  return <PlacementFlow banks={placementBanks} />;
}
