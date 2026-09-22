"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Scene from "@/components/ui/Scene";
import { cloudOpacity } from "@/lib/theme";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { track } from "@/lib/telemetry";

const MIN_PASSWORD = 8;

/**
 * Shared login / signup screen. Uses Supabase auth (email + password, Google,
 * GitHub, and an emailed sign-in link for forgotten passwords). When accounts
 * are not configured on this deployment it says so and offers guest mode, where
 * progress is saved on the device.
 */
export default function AuthScene({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const dest = isSignup ? "/start" : "/dashboard";
  const configured = isSupabaseConfigured();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "auth_callback") {
      const t = setTimeout(() => setError("That sign-in link did not work or has expired. Please try again."), 0);
      return () => clearTimeout(t);
    }
  }, []);

  const friendly = (message: string) => {
    if (/invalid login credentials/i.test(message)) return "That email and password do not match an account.";
    if (/already registered/i.test(message)) return "An account with this email already exists. Try signing in instead.";
    if (/rate limit/i.test(message)) return "Too many attempts. Wait a minute, then try again.";
    return message;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!configured) return;
    if (isSignup && password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters for your password.`);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() || undefined },
            // Bare callback URL (no query string) so it matches the exact Redirect
            // URL allowlisted in Supabase Auth.
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) {
          setError(friendly(signUpError.message));
          return;
        }
        track("signup", {});
        if (data.session) {
          router.push(dest);
          return;
        }
        setNotice("Check your email to confirm your account, then sign in.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError(friendly(signInError.message));
          return;
        }
        track("login", {});
        router.push(dest);
      }
    } finally {
      setLoading(false);
    }
  };

  const sendLink = async () => {
    setError(null);
    setNotice(null);
    if (!email) {
      setError("Type your email above first, then choose Email me a sign-in link.");
      return;
    }
    setLoading(true);
    const { error: otpError } = await createClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (otpError) setError(friendly(otpError.message));
    else setNotice("If that email has an account, a sign-in link is on its way. After you sign in you can set a new password in Profile.");
  };

  const oauth = async (provider: "google" | "github") => {
    setError(null);
    const { error: oauthError } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(friendly(oauthError.message));
  };

  const label: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 900, letterSpacing: 0.3, marginBottom: 6, color: "var(--dc-ink-soft)" };

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.auth} className="flex items-center justify-center">
      <div className="relative z-5 w-full" style={{ maxWidth: 440, padding: "40px 20px" }}>
        <div className="text-center" style={{ marginBottom: 22 }}>
          <Link href="/" aria-label="dreamcode home" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/clouds-neon/cutout-cloud-neon-1-03.webp" alt="" style={{ display: "block", width: 72, height: "auto", margin: "0 auto 8px", filter: "drop-shadow(0 0 14px rgba(255,190,240,.85))", animation: "floatySm 6s ease-in-out infinite" }} />
            <span className="font-display neon-title" style={{ fontWeight: 800, fontSize: 38, color: "#fff6fb" }}>
              dreamcode
            </span>
          </Link>
          <h1 className="sky-text" style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", margin: "8px 0 0" }}>
            {isSignup ? "Create your free account" : "Welcome back, night driver"}
          </h1>
        </div>

        {!configured ? (
          <div className="dc-paper" style={{ padding: "26px 26px" }}>
            <p className="dc-prose" style={{ margin: 0, fontSize: 15 }}>
              Accounts are not switched on for this site yet. You can still learn everything as a guest: your progress is saved on this device.
            </p>
            <Link href={isSignup ? "/start" : "/dashboard"} className="dc-btn dc-btn--primary dc-btn--block" style={{ marginTop: 18 }}>
              Continue as a guest {"→"}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="dc-paper" style={{ padding: "26px 26px" }} noValidate={false}>
            {isSignup && (
              <label className="block" style={{ marginBottom: 12 }}>
                <span style={label}>Display name (optional)</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="What should the clouds call you?" autoComplete="nickname" maxLength={60} className="dc-input" />
              </label>
            )}
            <label className="block" style={{ marginBottom: 12 }}>
              <span style={label}>Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" className="dc-input" />
            </label>
            <label className="block" style={{ marginBottom: 16 }}>
              <span style={label}>Password{isSignup ? ` (at least ${MIN_PASSWORD} characters)` : ""}</span>
              <input
                type="password"
                required
                minLength={isSignup ? MIN_PASSWORD : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="dc-input"
              />
            </label>
            {error && (
              <div role="alert" className="dc-callout dc-callout--danger" style={{ marginBottom: 12, fontSize: 13 }}>
                {error}
              </div>
            )}
            {notice && (
              <div role="status" className="dc-callout dc-callout--success" style={{ marginBottom: 12, fontSize: 13 }}>
                {notice}
              </div>
            )}
            <button type="submit" disabled={loading} className="dc-btn dc-btn--primary dc-btn--block">
              {loading ? "One moment..." : isSignup ? "Start the night drive →" : "Sign in →"}
            </button>
            {!isSignup && (
              <div className="text-center" style={{ marginTop: 12 }}>
                <button type="button" onClick={sendLink} disabled={loading} className="dc-ink-soft underline" style={{ background: "none", border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                  Forgot your password? Email me a sign-in link
                </button>
              </div>
            )}

            <div className="flex items-center" style={{ gap: 12, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--dc-inset-border)" }} />
              <span className="dc-ink-muted" style={{ fontSize: 12, fontWeight: 900 }}>
                OR
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--dc-inset-border)" }} />
            </div>

            <div className="flex flex-col" style={{ gap: 12 }}>
              <button type="button" onClick={() => oauth("google")} className="dc-btn dc-btn--quiet dc-btn--block dc-btn--sm" style={{ fontSize: 14.5 }}>
                Continue with Google
              </button>
              <button type="button" onClick={() => oauth("github")} className="dc-btn dc-btn--quiet dc-btn--block dc-btn--sm" style={{ fontSize: 14.5 }}>
                Continue with GitHub
              </button>
            </div>
          </form>
        )}

        <div className="sky-text text-center" style={{ marginTop: 18, fontSize: 14, fontWeight: 800, color: "#ffffff" }}>
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="underline" style={{ color: "var(--dc-link)" }}>
                Sign in
              </Link>
            </>
          ) : (
            <>
              New here?{" "}
              <Link href="/signup" className="underline" style={{ color: "var(--dc-link)" }}>
                Create a free account
              </Link>
            </>
          )}
        </div>
        <div className="flex flex-wrap justify-center" style={{ marginTop: 14, gap: 10 }}>
          <Link href="/" className="dc-pill">
            {"←"} Home
          </Link>
          <Link href="/lessons" className="dc-pill">
            Browse as a guest
          </Link>
        </div>
      </div>
    </Scene>
  );
}
