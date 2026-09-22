import type { Metadata } from "next";
import ProfileView from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your progress in every track, your settings and your account.",
  robots: { index: false },
};

export default function ProfilePage() {
  return <ProfileView />;
}
