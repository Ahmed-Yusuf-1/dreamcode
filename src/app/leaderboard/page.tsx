import type { Metadata } from "next";
import LeaderboardView from "@/components/leaderboard/LeaderboardView";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Who is climbing this week, and of all time. XP from lessons, peaks, projects and badges.",
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
