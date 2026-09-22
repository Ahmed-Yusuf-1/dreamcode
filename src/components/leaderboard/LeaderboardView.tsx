"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TopLine from "@/components/ui/TopLine";
import PageHeader from "@/components/ui/PageHeader";
import BadgeMedallion from "@/components/BadgeMedallion";
import StreakFlame from "@/components/StreakFlame";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { RARITY } from "@/lib/badges";
import { rankForLevel } from "@/lib/ranks";
import { setHandle, useAuthState, useUserProfile } from "@/lib/profile";

type Scope = "week" | "all";

interface Row {
  place: number;
  handle: string;
  emblem: string | null;
  level: number;
  xp: number;
  weekXp: number;
  streak: number;
  badges: number;
  isMe: boolean;
}

interface Standing {
  place: number;
  total: number;
  handle: string;
}

export default function LeaderboardView() {
  const catalog = useCatalog();
  const { profile } = useUserProfile();
  const { signedIn, resolved } = useAuthState();
  const [scope, setScope] = useState<Scope>("week");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [standing, setStanding] = useState<Standing | null>(null);
  const [failed, setFailed] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [handleError, setHandleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  // The board is an external system: the request starts here and is cancelled
  // when the range changes or the page goes away.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/leaderboard?scope=${scope}&limit=50`, { signal: controller.signal });
        if (!res.ok) throw new Error("request failed");
        const data = await res.json();
        setRows(Array.isArray(data.rows) ? data.rows : []);
        setStanding(data.standing ?? null);
        setFailed(false);
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
        setRows([]);
        setStanding(null);
        setFailed(true);
      }
    })();
    return () => controller.abort();
  }, [scope, reloadKey]);

  const badgeById = new Map(catalog.badges.map((b) => [b.id, b]));
  const claimed = !!profile.handle;
  const inTable = rows?.some((r) => r.isMe) ?? false;

  const claim = async () => {
    setSaving(true);
    setHandleError(null);
    const result = await setHandle(handleInput);
    setSaving(false);
    if (!result.ok) {
      setHandleError(result.error ?? "Could not save that handle.");
      return;
    }
    setHandleInput("");
    setReloadKey((n) => n + 1);
  };

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.badges}>
      <TopLine
        back={{ href: "/dashboard", label: "Dashboard" }}
        right={
          <Link href="/badges" className="dc-pill">
            Your badges {"→"}
          </Link>
        }
      />
      <div className="dc-container" style={{ maxWidth: 900, paddingTop: "4vh", paddingBottom: 90 }}>
        <PageHeader
          title="Who is climbing"
          lede="XP is the score: lessons, practice, peaks, projects and the badges you earn along the way. The weekly board resets every Monday, so anyone can take it."
        >
          <div className="flex justify-center" style={{ marginTop: 20 }}>
            <div className="dc-segmented" role="group" aria-label="Leaderboard range">
              <button type="button" className="dc-segmented__option" aria-pressed={scope === "week"} onClick={() => setScope("week")}>
                This week
              </button>
              <button type="button" className="dc-segmented__option" aria-pressed={scope === "all"} onClick={() => setScope("all")}>
                All time
              </button>
            </div>
          </div>
        </PageHeader>

        {resolved && !signedIn && (
          <div className="dc-glass text-center" style={{ padding: "18px 22px", marginBottom: 22 }}>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 19 }}>
              Your progress is saved in this browser
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: "6px 0 14px" }}>
              Make an account to keep your XP and badges, and to take a place on the board.
            </p>
            <Link href="/signup" className="dc-btn dc-btn--primary dc-btn--sm">
              Start free
            </Link>
          </div>
        )}

        {resolved && signedIn && !claimed && (
          <div className="dc-glass" style={{ padding: "18px 22px", marginBottom: 22 }}>
            <div className="font-display" style={{ fontWeight: 800, fontSize: 19 }}>
              Pick a handle to appear
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: "6px 0 12px" }}>
              This is the only name the board ever shows. Three to twenty characters: letters, numbers and underscores.
            </p>
            <div className="flex flex-wrap items-center" style={{ gap: 10 }}>
              <label className="flex-1" style={{ minWidth: 220 }}>
                <span className="sr-only">Your handle</span>
                <input
                  className="dc-search"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  placeholder="nova_42"
                  maxLength={20}
                  autoComplete="off"
                />
              </label>
              <button type="button" className="dc-btn dc-btn--primary dc-btn--sm" onClick={claim} disabled={saving || handleInput.trim().length < 3}>
                {saving ? "Saving..." : "Claim it"}
              </button>
            </div>
            {handleError && (
              <p style={{ fontSize: 13.5, fontWeight: 800, color: "#ffd0dd", margin: "10px 0 0" }} role="alert">
                {handleError}
              </p>
            )}
          </div>
        )}

        {claimed && profile.leaderboardHidden && (
          <div className="dc-glass text-center" style={{ padding: "14px 20px", marginBottom: 22 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "var(--dc-on-sky-soft)" }}>
              You are hidden from the board. Turn it back on in{" "}
              <Link href="/profile" style={{ color: "var(--dc-link)" }}>
                your profile
              </Link>
              .
            </span>
          </div>
        )}

        <section className="dc-glass" style={{ padding: "8px 8px 12px" }} aria-live="polite">
          {rows === null && <p style={{ padding: 20, fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: 0 }}>Reading the sky...</p>}
          {rows !== null && rows.length === 0 && (
            <p style={{ padding: 20, fontWeight: 700, color: "var(--dc-on-sky-soft)", margin: 0 }}>
              {failed ? "The board could not be reached. Try again in a moment." : "Nobody has claimed a handle yet. The first place is open."}
            </p>
          )}
          {rows !== null && rows.length > 0 && (
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {rows.map((row) => {
                const badge = row.emblem ? badgeById.get(row.emblem) : undefined;
                const rank = rankForLevel(row.level);
                const score = scope === "week" ? row.weekXp : row.xp;
                return (
                  <li
                    key={row.handle}
                    className="flex items-center"
                    style={{
                      gap: 14,
                      padding: "10px 14px",
                      borderRadius: 16,
                      background: row.isMe ? "var(--dc-glass-strong-bg)" : undefined,
                      border: row.isMe ? "1px solid var(--dc-glass-border)" : "1px solid transparent",
                    }}
                  >
                    <span
                      className="font-display"
                      style={{ width: 34, flexShrink: 0, textAlign: "right", fontWeight: 800, fontSize: row.place <= 3 ? 20 : 16, color: row.place <= 3 ? "#ffd86b" : "var(--dc-on-sky-muted)" }}
                    >
                      {row.place}
                    </span>
                    <div style={{ width: 40, flexShrink: 0 }}>
                      {badge ? (
                        <BadgeMedallion icon={badge.icon} accent={badge.accent} found ring={RARITY[badge.rarity].ring} />
                      ) : (
                        <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: "50%", background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.3)" }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display" style={{ fontWeight: 800, fontSize: 16.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {row.handle}
                        {row.isMe && <span style={{ fontSize: 12, fontWeight: 900, color: "var(--dc-link)" }}> {"·"} you</span>}
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: rank.accent }}>
                        {rank.name} {"·"} Level {row.level} {"·"} {row.badges} {row.badges === 1 ? "badge" : "badges"}
                      </div>
                    </div>
                    {row.streak > 0 && (
                      <span className="dc-chip dc-chip--glass" style={{ flexShrink: 0 }} title={`${row.streak} day streak`}>
                        <StreakFlame /> {row.streak}
                      </span>
                    )}
                    <span className="font-display" style={{ flexShrink: 0, fontWeight: 800, fontSize: 16, minWidth: 82, textAlign: "right" }}>
                      {score.toLocaleString()} XP
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {standing && !inTable && (
          <p className="text-center" style={{ fontSize: 14, fontWeight: 800, color: "var(--dc-on-sky-soft)", marginTop: 16 }}>
            You are {standing.place} of {standing.total} as {standing.handle}. Keep climbing.
          </p>
        )}

        <p className="text-center" style={{ fontSize: 13, fontWeight: 700, color: "var(--dc-on-sky-muted)", marginTop: 20 }}>
          Only your handle, emblem and progress appear here. Your name and email never do.
        </p>
      </div>
    </Scene>
  );
}
