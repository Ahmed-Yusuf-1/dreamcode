import type { Metadata } from "next";
import DashboardView from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your next lesson, reviews due, XP, streak and badges in one place.",
  robots: { index: false },
};

export default function DashboardPage() {
  return <DashboardView />;
}
