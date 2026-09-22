import type { Metadata } from "next";
import AuthScene from "@/components/AuthScene";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default function LoginPage() {
  return <AuthScene mode="login" />;
}
