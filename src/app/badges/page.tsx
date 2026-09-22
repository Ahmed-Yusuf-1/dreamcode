import type { Metadata } from "next";
import BadgesView from "@/components/catalog/BadgesView";

export const metadata: Metadata = {
  title: "Badges",
  description: "Every badge in dreamcode, its rarity, and exactly how to earn it.",
};

export default function BadgesPage() {
  return <BadgesView />;
}
