"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Wordmark from "./Wordmark";
import SpotifyPlayer from "./SpotifyPlayer";
import { useIsSignedIn, useUserProfile } from "@/lib/profile";

// Primary links shown inline on wide screens; the full set always lives in the
// Explore menu (so small screens still reach everything).
const PRIMARY: [string, string][] = [
  ["Lessons", "/lessons"],
  ["Journey", "/journey"],
  ["Dashboard", "/dashboard"],
];

const EXPLORE: { title: string; items: [string, string][] }[] = [
  {
    title: "Learn",
    items: [
      ["Lessons", "/lessons"],
      ["Journey map", "/journey"],
      ["Practice", "/practice/loops"],
    ],
  },
  {
    title: "Solve",
    items: [
      ["Problem Peaks", "/peaks"],
      ["Projects", "/projects"],
      ["Challenges", "/challenge/cloud-hopper"],
    ],
  },
  {
    title: "Your sky",
    items: [
      ["Dashboard", "/dashboard"],
      ["Badges", "/badges"],
      ["Night review", "/review"],
      ["Profile", "/profile"],
    ],
  },
];

export default function NavBar({ isHome = false }: { isHome?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const signedIn = useIsSignedIn();
  const { profile } = useUserProfile();

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!exploreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [exploreOpen]);

  // Transparent only over the very top of the home hero; solid everywhere else.
  const solid = !isHome || scrolled;

  const linkStyle: React.CSSProperties = {
    color: "rgba(255,255,255,.95)",
    fontWeight: 800,
    fontSize: 15,
    textShadow: "0 2px 12px rgba(20,16,50,.7)",
    whiteSpace: "nowrap",
  };

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 transition-colors duration-300"
      style={{
        height: "var(--nav-h)",
        background: solid ? "rgba(18,16,55,.82)" : "transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
        borderBottom: solid ? "1px solid rgba(255,255,255,.14)" : "1px solid transparent",
        boxShadow: solid ? "0 10px 30px rgba(8,6,30,.35)" : "none",
      }}
    >
      <div
        className="flex h-full items-center justify-between"
        style={{ padding: "0 clamp(12px, 4vw, 44px)", gap: 8 }}
      >
        {/* left: brand, flush to the corner */}
        <Wordmark />

        {/* right: everything else, flush to the corner. Tighter gap on phones so
            the signed-in profile chip does not crowd the wordmark. */}
        <nav className="flex items-center gap-2.5 sm:gap-[18px]">
          <div className="hidden items-center lg:flex" style={{ gap: 22 }}>
            {PRIMARY.map(([label, href]) => (
              <Link
                key={href}
                id={`nav-link-${label.toLowerCase()}`}
                href={href}
                className="cursor-pointer transition-colors hover:text-[#ffb3e2]"
                style={linkStyle}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Explore: opens on hover (desktop) or tap (touch) */}
          <div
            ref={exploreRef}
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setExploreOpen(false);
                document.getElementById("nav-btn-explore")?.focus();
                e.preventDefault();
              } else if (e.key === "ArrowDown") {
                if (!exploreOpen) {
                  setExploreOpen(true);
                  e.preventDefault();
                  return;
                }
                const links = exploreRef.current?.querySelectorAll<HTMLAnchorElement>("a");
                if (links && links.length > 0) {
                  const active = document.activeElement;
                  const index = Array.from(links).indexOf(active as HTMLAnchorElement);
                  const nextIndex = (index + 1) % links.length;
                  links[nextIndex].focus();
                  e.preventDefault();
                }
              } else if (e.key === "ArrowUp") {
                if (!exploreOpen) return;
                const links = exploreRef.current?.querySelectorAll<HTMLAnchorElement>("a");
                if (links && links.length > 0) {
                  const active = document.activeElement;
                  const index = Array.from(links).indexOf(active as HTMLAnchorElement);
                  const prevIndex = index <= 0 ? links.length - 1 : index - 1;
                  links[prevIndex].focus();
                  e.preventDefault();
                }
              }
            }}
            onBlur={(e) => {
              if (exploreRef.current && !exploreRef.current.contains(e.relatedTarget as Node)) {
                setExploreOpen(false);
              }
            }}
          >
            <button
              type="button"
              id="nav-btn-explore"
              onClick={() => setExploreOpen((o) => !o)}
              className="flex cursor-pointer items-center transition-colors hover:text-[#ffb3e2]"
              style={{ ...linkStyle, gap: 5, background: "none", border: "none" }}
              aria-haspopup="true"
              aria-expanded={exploreOpen}
              aria-controls="explore-menu"
            >
              Explore
              <span
                className="transition-transform duration-200"
                style={{ fontSize: 11, opacity: 0.85, transform: exploreOpen ? "rotate(180deg)" : "none" }}
              >
                ▾
              </span>
            </button>

            <div
              id="explore-menu"
              role="menu"
              className="fixed"
              style={{
                // Anchor to the viewport's right edge (not the button), so on
                // narrow screens the panel never runs off the left edge. Width is
                // capped to the viewport, matching the Spotify panel's pattern.
                top: "calc(var(--nav-h) + 6px)",
                right: "clamp(12px, 4vw, 44px)",
                zIndex: 80,
                opacity: exploreOpen ? 1 : 0,
                visibility: exploreOpen ? "visible" : "hidden",
                transform: exploreOpen ? "translateY(0)" : "translateY(-6px)",
                transition: "opacity .2s ease, transform .2s ease, visibility .2s",
                width: "min(440px, calc(100vw - 24px))",
                maxWidth: "calc(100vw - 24px)",
                background: "rgba(20,17,60,.95)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,.16)",
                borderRadius: 20,
                padding: "20px 22px",
                boxShadow: "0 0 36px rgba(189,128,255,.18), 0 28px 60px rgba(8,6,30,.55)",
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: 18 }}>
                {EXPLORE.map((group) => (
                  <div key={group.title}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: 1.2,
                        color: "#bfa8f5",
                        textTransform: "uppercase",
                        marginBottom: 10,
                      }}
                    >
                      {group.title}
                    </div>
                    <div className="flex flex-col" style={{ gap: 9 }}>
                      {group.items.map(([label, href]) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setExploreOpen(false)}
                          role="menuitem"
                          className="cursor-pointer transition-colors hover:text-[#ffd9ef]"
                          style={{ color: "rgba(255,255,255,.9)", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SpotifyPlayer />

          {signedIn ? (
            // Signed in: an account chip (the profile hub is where Sign out lives).
            // No "Start free" - the learner already has an account.
            <Link
              href="/profile"
              aria-label="Your profile and settings"
              className="font-display flex items-center justify-center transition-transform hover:-translate-y-0.5"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ffb6d9, #cdb9f7)",
                border: "2px solid rgba(255,255,255,.85)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: 15,
                boxShadow: "0 0 16px rgba(255,170,230,.45)",
                flexShrink: 0,
              }}
            >
              {profile.initial}
            </Link>
          ) : (
            <Link
              href="/signup"
              id="nav-btn-signup"
              className="hidden cursor-pointer backdrop-blur-md transition-colors hover:bg-white/32 sm:block"
              style={{
                background: "rgba(255,255,255,.16)",
                border: "2px solid rgba(255,255,255,.7)",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: 14,
                padding: "9px 20px",
                borderRadius: 999,
                boxShadow: "0 0 18px rgba(255,170,220,.35)",
                whiteSpace: "nowrap",
              }}
            >
              Start free
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
