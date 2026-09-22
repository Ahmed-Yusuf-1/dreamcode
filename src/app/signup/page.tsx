import type { Metadata } from "next";
import AuthScene from "@/components/AuthScene";

export const metadata: Metadata = {
  title: "Create a free account",
  description: "Save your progress across devices. Learning as a guest stays free too.",
};

export default function SignupPage() {
  return <AuthScene mode="signup" />;
}
