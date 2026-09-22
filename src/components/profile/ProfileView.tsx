"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TopLine from "@/components/ui/TopLine";
import TrackPicker from "@/components/ui/TrackPicker";
import StreakFlame from "@/components/StreakFlame";
import BadgeMedallion from "@/components/BadgeMedallion";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { currentStreak, setEmblem, setHandle, setLeaderboardHidden, useAuthState, useUserProfile } from "@/lib/profile";
import { RARITY } from "@/lib/badges";
import { rankForLevel, nextRank, trackSkill, XP_PER_LEVEL } from "@/lib/ranks";
import { useAppearance, type AppearancePreference } from "@/lib/appearance";
import { createClient } from "@/lib/supabase/client";
import { TRACKS, lessonsDone } from "@/lib/catalog";

interface ActivityEvent {
  name: string;
  props?: Record<string, unknown>;
  createdAt: string;
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="cursor-pointer"
      style={{
        width: 52,
        height: 30,
        borderRadius: 999,
        border: "2px solid rgba(255,255,255,.7)",
        background: on ? "linear-gradient(135deg, #a9ecc9, #7fd6a4)" : "rgba(255,255,255,.2)",
        position: "relative",
        transition: "background .2s ease",
        flexShrink: 0,
      }}
    >
      <span style={{ position: "absolute", top: 2, left: on ? 24 : 2, width: 22, height: 22, borderRadius: "50%", background: "#ffffff", boxShadow: "0 2px 8px rgba(20,16,50,.35)", transition: "left .2s ease" }} />
    </button>
  );
}

function Setting({ title, body, children }: { title: string; body: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between" style={{ gap: 16, marginBottom: 18 }}>
      <div>
        <div style={{ fontWeight: 900, fontSize: 15 }}>{title}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dc-on-sky-soft)", lineHeight: 1.5, marginTop: 2 }}>{body}</div>
      </div>
      {children}
    </div>
  );
}

export default function ProfileView() {
  const catalog = useCatalog();
  const { profile, updateProfile } = useUserProfile();
  const { signedIn, resolved } = useAuthState();
  const { preference, resolvedTheme, setPreference } = useAppearance();
  const [events, setEvents] = useState<ActivityEvent[] | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [password, setPassword] = useState("");
  const [passwordNote, setPasswordNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  // Null until the learner types: the field shows their saved handle up to then.
  const [handleDraft, setHandleDraft] = useState<string | null>(null);
  const [handleNote, setHandleNote] = useState<string | null>(null);
  const [handleSaving, setHandleSaving] = useState(false);

  const handleValue = handleDraft ?? profile.handle ?? "";
  const rank = rankForLevel(profile.level);
  const up = nextRank(profile.level);
  const earnedBadges = catalog.badges.filter((b) => profile.unlockedBadges.includes(b.id));
  const emblem = profile.emblem ? earnedBadges.find((b) => b.id === profile.emblem) : undefined;

  useEffect(() => {
    if (!resolved || !signedIn) return;
    let cancelled = false;
    fetch("/api/events")
      .then((res) => (res.ok ? res.json() : { events: [] }))
      .then((data) => {
        if (!cancelled) setEvents(Array.isArray(data.events) ? data.events : []);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });
    return () => {
      cancelled = true;
    };
  }, [resolved, signedIn]);

  const completed = profile.completedStops || [];
  const done = new Set(completed);
  const totalXp = (profile.level - 1) * XP_PER_LEVEL + profile.xp;
  const titleFor = (slug: unknown) => {
    const s = String(slug ?? "");
    return (
      catalog.lessons.find((l) => l.slug === s)?.catalogTitle ??
      catalog.challenges.find((c) => c.slug === s)?.name ??
      catalog.projects.find((p) => p.id === s)?.title ??
      s
    );
  };

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    const next = nameDraft.trim().slice(0, 60);
    if (next) updateProfile({ name: next });
    setEditingName(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setPasswordNote({ ok: false, text: "Use at least 8 characters." });
      return;
    }
    const { error } = await createClient().auth.updateUser({ password });
    setPassword("");
    setPasswordNote(error ? { ok: false, text: error.message } : { ok: true, text: "Password updated." });
  };

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), profile }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dreamcode-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetGuest = () => {
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("dc_") && key !== "dc_appearance") localStorage.removeItem(key);
      }
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.profile}>
      <TopLine
        back={{ href: "/dashboard", label: "Dashboard" }}
        right={
          signedIn ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="dc-pill">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="dc-pill">
              Sign in
            </Link>
          )
        }
      />

      <div className="dc-container" style={{ maxWidth: 680, paddingTop: "3vh", paddingBottom: 90, display: "flex", flexDirection: "column", gap: 18 }}>
        {resolved && !signedIn && (
          <div className="dc-glass flex flex-wrap items-center justify-between" style={{ padding: "13px 18px", gap: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.5 }}>You are learning as a guest. Progress is saved on this device only.</div>
            <div className="flex" style={{ gap: 8 }}>
              <Link href="/signup" className="dc-btn dc-btn--light dc-btn--sm">
                Create account
              </Link>
            </div>
          </div>
        )}

        <section className="dc-glass text-center" style={{ padding: "30px 26px" }}>
          {emblem ? (
            <div className="mx-auto" style={{ width: 92 }} title={`${emblem.name} · ${RARITY[emblem.rarity].label}`}>
              <BadgeMedallion icon={emblem.icon} accent={emblem.accent} found ring={RARITY[emblem.rarity].ring} />
            </div>
          ) : (
            <div
              className="font-display mx-auto flex items-center justify-center"
              aria-hidden="true"
              style={{ width: 86, height: 86, borderRadius: "50%", background: "linear-gradient(135deg, #ffb6d9, #cdb9f7)", border: "3px solid #ffffff", fontWeight: 800, color: "#ffffff", fontSize: 36, boxShadow: "0 0 30px rgba(255,170,230,.5)" }}
            >
              {profile.initial}
            </div>
          )}
          {editingName ? (
            <form onSubmit={saveName} className="mx-auto flex flex-wrap justify-center" style={{ gap: 8, marginTop: 14, maxWidth: 360 }}>
              <label className="sr-only" htmlFor="display-name">
                Display name
              </label>
              <input id="display-name" autoFocus value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} maxLength={60} className="dc-search" style={{ flex: 1, minWidth: 180 }} />
              <button type="submit" className="dc-btn dc-btn--light dc-btn--sm">
                Save
              </button>
            </form>
          ) : (
            <h1 className="font-display" style={{ fontWeight: 800, fontSize: 28, margin: "14px 0 0", textShadow: "var(--dc-sky-text-shadow)" }}>
              {profile.name}{" "}
              <button
                type="button"
                onClick={() => {
                  setNameDraft(profile.name);
                  setEditingName(true);
                }}
                className="dc-pill"
                style={{ fontSize: 11.5, padding: "4px 10px", verticalAlign: "middle" }}
              >
                Edit
              </button>
            </h1>
          )}
          {profile.handle && (
            <div className="font-mono" style={{ fontSize: 14, fontWeight: 800, color: "var(--dc-link)", marginTop: 6 }}>
              @{profile.handle}
            </div>
          )}
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--dc-on-sky-soft)", marginTop: 4 }}>
            <span style={{ color: rank.accent, fontWeight: 900 }}>{rank.name}</span> {"·"} Level {profile.level}
            {signedIn && profile.createdAt
              ? ` · learning since ${new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}`
              : signedIn
                ? " · signed in"
                : " · guest"}
          </div>
          <div className="flex flex-wrap justify-center" style={{ gap: 10, marginTop: 16 }}>
            <span className="dc-chip dc-chip--solid">
              <StreakFlame /> {currentStreak(profile)}-day streak
            </span>
            <span className="dc-chip dc-chip--solid">{profile.unlockedBadges.length} badges</span>
            <span className="dc-chip dc-chip--solid">{totalXp} XP</span>
            {profile.longestStreak > currentStreak(profile) && (
              <span className="dc-chip dc-chip--glass" title="Your best run so far">
                best {profile.longestStreak} days
              </span>
            )}
          </div>
          {up && (
            <>
              <div className="dc-progress" style={{ height: 8, marginTop: 18, maxWidth: 420, marginInline: "auto" }}>
                <div className="dc-progress__fill" style={{ width: `${Math.round((profile.xp / XP_PER_LEVEL) * 100)}%` }} />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--dc-on-sky-muted)", marginTop: 6 }}>
                {XP_PER_LEVEL - profile.xp} XP to level {profile.level + 1}
                {up.from > profile.level ? ` · ${up.name} at level ${up.from}` : ""}
              </div>
            </>
          )}
        </section>

        <section className="dc-glass" style={{ padding: "24px 26px" }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 19, margin: "0 0 6px" }}>
            Your public face
          </h2>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: "0 0 16px" }}>
            The leaderboard shows your handle, your emblem and your progress. Your name and email never leave your account.
          </p>

          {!signedIn && (
            <p style={{ fontSize: 13.5, fontWeight: 800, color: "var(--dc-on-sky-muted)", margin: "0 0 14px" }}>
              A handle belongs to an account.{" "}
              <Link href="/signup" style={{ color: "var(--dc-link)" }}>
                Create one
              </Link>{" "}
              to claim yours and keep your badges.
            </p>
          )}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setHandleSaving(true);
              setHandleNote(null);
              const result = await setHandle(handleValue);
              setHandleSaving(false);
              setHandleNote(result.ok ? "Saved." : result.error ?? "Could not save that handle.");
            }}
            className="flex flex-wrap items-center"
            style={{ gap: 10 }}
          >
            <label className="flex-1" style={{ minWidth: 200 }}>
              <span className="dc-kicker" style={{ display: "block", marginBottom: 6 }}>
                Handle
              </span>
              <input
                className="dc-search"
                value={handleValue}
                onChange={(e) => setHandleDraft(e.target.value)}
                placeholder="nova_42"
                maxLength={20}
                autoComplete="off"
                aria-describedby="handle-note"
                disabled={!signedIn}
              />
            </label>
            <button type="submit" className="dc-btn dc-btn--light dc-btn--sm" style={{ marginTop: 22 }} disabled={!signedIn || handleSaving || handleValue.trim().length < 3}>
              {handleSaving ? "Saving..." : profile.handle ? "Change" : "Claim"}
            </button>
          </form>
          <p id="handle-note" style={{ fontSize: 13, fontWeight: 800, color: handleNote === "Saved." ? "#b9f5d2" : "#ffd0dd", margin: "8px 0 0", minHeight: 18 }} role="status">
            {handleNote}
          </p>

          <div style={{ marginTop: 18 }}>
            <span className="dc-kicker" style={{ display: "block", marginBottom: 8 }}>
              Emblem {earnedBadges.length > 0 ? `· ${earnedBadges.length} earned` : ""}
            </span>
            {earnedBadges.length === 0 ? (
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--dc-on-sky-muted)", margin: 0 }}>
                Earn a badge and you can wear it here.{" "}
                <Link href="/badges" style={{ color: "var(--dc-link)", fontWeight: 800 }}>
                  See the trophy case
                </Link>
                .
              </p>
            ) : (
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {earnedBadges.map((badge) => (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => setEmblem(profile.emblem === badge.id ? null : badge.id)}
                    aria-pressed={profile.emblem === badge.id}
                    title={`${badge.name} · ${RARITY[badge.rarity].label}`}
                    style={{
                      width: 54,
                      padding: 4,
                      borderRadius: 16,
                      border: profile.emblem === badge.id ? "2px solid #ffffff" : "2px solid transparent",
                      background: "none",
                      cursor: "pointer",
                    }}
                  >
                    <BadgeMedallion icon={badge.icon} accent={badge.accent} found ring={RARITY[badge.rarity].ring} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 18 }}>
            <Setting title="Show me on the leaderboard" body="Your handle, emblem, level, XP, streak and badge count. Turn it off and you disappear from the board.">
              <Toggle on={!profile.leaderboardHidden} onChange={(v) => setLeaderboardHidden(!v)} label="Show me on the leaderboard" />
            </Setting>
          </div>
        </section>

        <section className="dc-glass" style={{ padding: "24px 26px" }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 19, margin: "0 0 14px" }}>
            Progress by track
          </h2>
          <ul className="flex flex-col" style={{ gap: 14, listStyle: "none", padding: 0, margin: 0 }}>
            {TRACKS.map((t) => {
              const { done: d, total } = lessonsDone(catalog, t.id, completed);
              const peaks = catalog.challenges.filter((c) => c.track === t.id);
              const builds = catalog.projects.filter((p) => p.track === t.id);
              return (
                <li key={t.id}>
                  <div className="flex flex-wrap items-baseline justify-between" style={{ gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 900, fontSize: 15 }}>
                      {t.label}{" "}
                      <span className="dc-chip dc-chip--glass" style={{ fontSize: 10.5, padding: "2px 8px", verticalAlign: "middle" }}>
                        {trackSkill(catalog, t.id, completed).label}
                      </span>
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: "var(--dc-on-sky-muted)" }}>
                      {d}/{total} lessons
                      {peaks.length ? ` · ${peaks.filter((c) => done.has(c.slug)).length}/${peaks.length} peaks` : ""}
                      {builds.length ? ` · ${builds.filter((p) => done.has(p.id)).length}/${builds.length} projects` : ""}
                    </span>
                  </div>
                  <div className="dc-progress" style={{ height: 8 }}>
                    <div className="dc-progress__fill" style={{ width: `${total ? Math.round((d / total) * 100) : 0}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col items-start" style={{ gap: 10, marginTop: 20 }}>
            <span className="dc-kicker">Active track</span>
            <TrackPicker />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dc-on-sky-soft)" }}>
              Not sure where to start?{" "}
              <Link href="/placement" className="underline" style={{ color: "var(--dc-link)", fontWeight: 800 }}>
                Take the placement check
              </Link>
              .
            </span>
          </div>
        </section>

        <section className="dc-glass" style={{ padding: "24px 26px" }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 19, margin: "0 0 16px" }}>
            How you fly
          </h2>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontWeight: 900, fontSize: 15 }}>Sky appearance</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--dc-on-sky-soft)", lineHeight: 1.5, marginTop: 2 }}>
              Automatic shows Sunset Arcade from 7 a.m. to 7 p.m. and Midnight Focus overnight. Right now it is {resolvedTheme === "light" ? "Sunset Arcade" : "Midnight Focus"}.
            </div>
            <div className="appearance-picker" role="radiogroup" aria-label="Sky appearance">
              {(
                [
                  ["automatic", "Automatic"],
                  ["light", "Sunset (light)"],
                  ["dark", "Midnight (dark)"],
                ] as const
              ).map(([value, label]) => (
                <button key={value} type="button" role="radio" aria-checked={preference === value} onClick={() => setPreference(value as AppearancePreference)} className="appearance-picker__option" data-active={preference === value ? "true" : "false"}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <Setting title="Dream Guide (AI mentor)" body="Asks questions when you are stuck and never writes your code. Everything works with it off.">
            <Toggle label="Dream Guide" on={profile.guideEnabled} onChange={(v) => updateProfile({ guideEnabled: v })} />
          </Setting>
          <Setting title="Sound effects" body="Soft chimes for passing tests and earning badges.">
            <Toggle label="Sound effects" on={profile.soundsEnabled} onChange={(v) => updateProfile({ soundsEnabled: v })} />
          </Setting>
          <Setting title="Night review reminders" body="Notifications are not available yet. Cards due for review always show on your dashboard.">
            <span className="dc-chip dc-chip--glass" style={{ fontSize: 10.5 }}>
              COMING SOON
            </span>
          </Setting>
        </section>

        {signedIn && (
          <section className="dc-glass" style={{ padding: "24px 26px" }}>
            <h2 className="font-display" style={{ fontWeight: 800, fontSize: 19, margin: "0 0 14px" }}>
              Account
            </h2>
            <form onSubmit={changePassword} className="flex flex-wrap items-end" style={{ gap: 10 }}>
              <label style={{ flex: 1, minWidth: 200 }}>
                <span style={{ display: "block", fontWeight: 900, fontSize: 13.5, marginBottom: 6 }}>New password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} className="dc-search" />
              </label>
              <button type="submit" className="dc-btn dc-btn--light dc-btn--sm">
                Update password
              </button>
            </form>
            {passwordNote && (
              <div role="status" className={`dc-callout ${passwordNote.ok ? "dc-callout--success" : "dc-callout--danger"}`} style={{ marginTop: 12, fontSize: 13 }}>
                {passwordNote.text}
              </div>
            )}
          </section>
        )}

        {signedIn && (
          <section className="dc-glass" style={{ padding: "24px 26px" }}>
            <h2 className="font-display" style={{ fontWeight: 800, fontSize: 19, margin: "0 0 14px" }}>
              Recent activity
            </h2>
            {events === null ? (
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dc-on-sky-muted)", margin: 0 }}>Loading your flight log...</p>
            ) : events.length === 0 ? (
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--dc-on-sky-muted)", margin: 0 }}>Nothing logged yet. Your runs, lessons and peaks will show up here.</p>
            ) : (
              <ul className="flex flex-col" style={{ gap: 10, listStyle: "none", padding: 0, margin: 0 }}>
                {events.slice(0, 30).map((e, i) => (
                  <li key={i} className="flex items-start justify-between" style={{ gap: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.45 }}>{describeEvent(e, titleFor)}</span>
                    <time dateTime={e.createdAt} style={{ fontSize: 11.5, fontWeight: 800, color: "var(--dc-on-sky-muted)", whiteSpace: "nowrap" }}>
                      {new Date(e.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <section className="dc-glass" style={{ padding: "22px 26px" }}>
          <h2 className="font-display" style={{ fontWeight: 800, fontSize: 19, margin: "0 0 12px" }}>
            Your data
          </h2>
          <div className="flex flex-wrap" style={{ gap: 10 }}>
            <button type="button" className="dc-btn dc-btn--secondary dc-btn--sm" onClick={exportProgress}>
              Download my progress
            </button>
            {!signedIn &&
              (confirmReset ? (
                <>
                  <button type="button" className="dc-btn dc-btn--primary dc-btn--sm" onClick={resetGuest}>
                    Yes, erase this device&apos;s progress
                  </button>
                  <button type="button" className="dc-btn dc-btn--secondary dc-btn--sm" onClick={() => setConfirmReset(false)}>
                    Keep it
                  </button>
                </>
              ) : (
                <button type="button" className="dc-btn dc-btn--secondary dc-btn--sm" onClick={() => setConfirmReset(true)}>
                  Start over on this device
                </button>
              ))}
          </div>
        </section>
      </div>
    </Scene>
  );
}

function describeEvent(e: ActivityEvent, titleFor: (slug: unknown) => string) {
  const p = e.props || {};
  switch (e.name) {
    case "signup":
      return "Joined dreamcode";
    case "login":
      return "Signed in";
    case "lesson_started":
      return `Opened ${titleFor(p.slug)}`;
    case "lesson_completed":
      return `Finished the ${titleFor(p.slug)} lesson`;
    case "code_run":
      return `Ran code in ${titleFor(p.slug)}${p.ok ? "" : " (it hit an error)"}`;
    case "practice_completed":
      return `Finished the ${titleFor(p.slug)} practice`;
    case "challenge_started":
      return `Started the ${titleFor(p.slug)} peak`;
    case "challenge_passed":
      return `Cleared the ${titleFor(p.slug)} peak`;
    case "project_completed":
      return `Built ${titleFor(p.slug)}`;
    case "placement_completed":
      return `Took the ${String(p.track ?? "")} placement check`;
    case "track_switched":
      return `Switched to ${String(p.track ?? "another track")}`;
    case "review_rated":
      return "Reviewed a card";
    default:
      return e.name.replace(/_/g, " ");
  }
}
