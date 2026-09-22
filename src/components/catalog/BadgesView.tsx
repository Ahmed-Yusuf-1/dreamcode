"use client";

import Link from "next/link";
import Scene from "@/components/ui/Scene";
import TopLine from "@/components/ui/TopLine";
import PageHeader from "@/components/ui/PageHeader";
import BadgeMedallion from "@/components/BadgeMedallion";
import { useCatalog } from "@/components/CatalogProvider";
import { cloudOpacity } from "@/lib/theme";
import { badgeSnapshot, setEmblem, useUserProfile } from "@/lib/profile";
import { useActiveTrack } from "@/lib/track";
import { nextBadges } from "@/lib/badgeProgress";
import { badgeProgress, RARITY, RARITY_ORDER } from "@/lib/badges";
import type { BadgeRarity } from "@/content/types";

export default function BadgesView() {
  const catalog = useCatalog();
  const { profile } = useUserProfile();
  const { track } = useActiveTrack();
  const unlocked = new Set(profile.unlockedBadges);
  const snap = badgeSnapshot(profile);
  const suggestions = nextBadges(catalog, track, snap, profile.unlockedBadges, 3);

  const owned = (rarity: BadgeRarity) => catalog.badges.filter((b) => b.rarity === rarity && unlocked.has(b.id)).length;
  const legendary = owned("legendary");

  return (
    <Scene clouds="drift" cloudScale={cloudOpacity.badges}>
      <TopLine
        back={{ href: "/dashboard", label: "Dashboard" }}
        right={
          <Link href="/leaderboard" className="dc-pill">
            Leaderboard {"→"}
          </Link>
        }
      />
      <div className="dc-container" style={{ maxWidth: 1100, paddingTop: "4vh", paddingBottom: 90 }}>
        <PageHeader
          title="Your trophy case"
          lede={`${unlocked.size} of ${catalog.badges.length} earned${legendary > 0 ? `, including ${legendary} legendary` : ""}. Every badge is a rule, not a participation prize: the rare ones take a track, a month, or a habit.`}
        >
          <div className="flex flex-wrap justify-center" style={{ gap: 10, marginTop: 20 }}>
            {RARITY_ORDER.map((rarity) => (
              <span key={rarity} className="dc-chip dc-chip--glass" style={{ borderColor: RARITY[rarity].ring, color: RARITY[rarity].ring }}>
                {owned(rarity)} / {catalog.badges.filter((b) => b.rarity === rarity).length} {RARITY[rarity].label}
              </span>
            ))}
          </div>
        </PageHeader>

        {suggestions.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 className="dc-section-title" style={{ marginBottom: 14 }}>
              Closest to earning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 14 }}>
              {suggestions.map(({ badge, action, href, fraction, progressLabel }) => (
                <Link key={badge.id} href={href} className="dc-glass dc-depth-card dc-depth-card--interactive flex" style={{ padding: "16px 18px", gap: 14 }}>
                  <div style={{ width: 56, flexShrink: 0 }}>
                    <BadgeMedallion icon={badge.icon} accent={badge.accent} found={false} />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="dc-kicker" style={{ color: RARITY[badge.rarity].ring }}>
                      {RARITY[badge.rarity].label}
                    </div>
                    <div className="font-display" style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--dc-on-sky-soft)", marginTop: 2 }}>{action} {"→"}</div>
                    {fraction !== null && (
                      <>
                        <div className="dc-progress" style={{ height: 7, marginTop: 8 }}>
                          <div className="dc-progress__fill" style={{ width: `${Math.round(fraction * 100)}%` }} />
                        </div>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--dc-on-sky-muted)", marginTop: 4 }}>{progressLabel}</div>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {RARITY_ORDER.map((rarity) => {
          const list = catalog.badges.filter((b) => b.rarity === rarity);
          if (list.length === 0) return null;
          return (
            <section key={rarity} style={{ marginBottom: 36 }}>
              <div className="flex flex-wrap items-baseline" style={{ gap: 12, marginBottom: 14 }}>
                <h2 className="dc-section-title" style={{ color: RARITY[rarity].ring }}>
                  {RARITY[rarity].label}
                </h2>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--dc-on-sky-soft)" }}>
                  {RARITY[rarity].blurb} {"·"} +{RARITY[rarity].xp} XP each
                </span>
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: 16, listStyle: "none", padding: 0, margin: 0 }}>
                {list.map((badge, i) => {
                  const found = unlocked.has(badge.id);
                  const hidden = !!badge.secret && !found;
                  const progress = found || hidden ? null : badgeProgress(badge, snap, catalog);
                  const worn = profile.emblem === badge.id;
                  return (
                    <li key={badge.id} className={`dc-glass text-center ${found ? "" : "dc-locked"}`} style={{ padding: "22px 14px 18px" }}>
                      <div
                        style={{
                          width: "100%",
                          maxWidth: 104,
                          margin: "0 auto",
                          animation: found ? `floatySm ${7 + (i % 4) * 0.5}s ease-in-out ${(i % 5) * 0.3}s infinite` : undefined,
                        }}
                      >
                        <BadgeMedallion
                          icon={hidden ? "star" : badge.icon}
                          accent={badge.accent}
                          found={found}
                          ring={found ? RARITY[badge.rarity].ring : undefined}
                        />
                      </div>
                      <div className="font-display" style={{ fontWeight: 800, fontSize: 17, marginTop: 12, textShadow: "var(--dc-sky-text-shadow)" }}>
                        {hidden ? "Hidden badge" : badge.name}
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.5, color: "var(--dc-on-sky-soft)", margin: "4px 0 0" }}>
                        {hidden ? "Found by doing something unusual. No hints." : badge.desc}
                      </p>
                      {progress && progress.target > 1 && (
                        <>
                          <div className="dc-progress" style={{ height: 6, marginTop: 10 }}>
                            <div className="dc-progress__fill" style={{ width: `${Math.round((progress.current / progress.target) * 100)}%` }} />
                          </div>
                          <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--dc-on-sky-muted)", marginTop: 4 }}>{progress.label}</div>
                        </>
                      )}
                      {found && (
                        <button
                          type="button"
                          onClick={() => setEmblem(worn ? null : badge.id)}
                          className="dc-btn dc-btn--quiet dc-btn--sm"
                          style={{ marginTop: 12 }}
                          aria-pressed={worn}
                        >
                          {worn ? "✓ Your emblem" : "Wear this"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </Scene>
  );
}
