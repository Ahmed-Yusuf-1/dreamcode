"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Spotify in the nav bar. Frontend-only, but a *real* integration: once the
 * learner connects, we mount Spotify's official embed player and keep it
 * mounted inside the persistent nav. Because the nav lives in the root layout
 * (it does not remount on route changes), the music keeps playing as the user
 * moves between lessons, the journey, challenges, and so on.
 *
 * A full "log in with Spotify" experience (the Web Playback SDK, saved
 * playlists, scrubbing your own library) needs OAuth + a backend, which is a
 * later phase. This delivers always-available focus music today.
 */

// A calm "focus / lo-fi" playlist to code to. Swap the id for any playlist.
const PLAYLIST_ID = "37i9dQZF1DWWQRwui0ExPn"; // Lo-Fi Beats
const EMBED_SRC = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`;
const STORAGE_KEY = "dc_spotify_connected";
const STORAGE_STYLE_KEY = "dc_spotify_btn_style";

const BUTTON_STYLES = [
  { id: "theme-default", name: "Glassy Lavender" },
  { id: "neon-cyan", name: "Neon Cyan" },
  { id: "floating-cloud", name: "Floating Cloud" },
  { id: "cloud-shaped", name: "Cloud Shape" },
];

function SpotifyMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="transition-colors duration-200">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path
        d="M6.4 10.2c3.3-1 7.1-.8 9.9.9M7 12.9c2.7-.8 5.7-.6 8 .8M7.6 15.4c2.1-.6 4.4-.5 6.2.6"
        stroke="#0e2247"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Equalizer() {
  return (
    <span className="flex items-end" style={{ gap: 2, height: 14 }} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: "currentColor",
            transformOrigin: "bottom",
            animation: `eqbar ${0.7 + i * 0.18}s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

export default function SpotifyPlayer() {
  const [connected, setConnected] = useState(false);
  const [open, setOpen] = useState(false);
  const [styleIndex, setStyleIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // read saved connection on the client. Both server and first client render
  // start at false, so there is no hydration mismatch; the effect then syncs.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConnected(true);
      }
      const savedStyle = localStorage.getItem(STORAGE_STYLE_KEY);
      if (savedStyle) {
        const idx = BUTTON_STYLES.findIndex((s) => s.id === savedStyle);
        if (idx !== -1) {
          setStyleIndex(idx);
        }
      }
    } catch {}
  }, []);

  // close the panel when clicking outside it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const connect = () => {
    setConnected(true);
    setOpen(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  const disconnect = () => {
    setConnected(false);
    setOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const changeStyle = (idx: number) => {
    setStyleIndex(idx);
    try {
      localStorage.setItem(STORAGE_STYLE_KEY, BUTTON_STYLES[idx].id);
    } catch {}
  };

  return (
    <div ref={wrapRef} className="relative">
      {!connected ? (
        // Render unconnected button based on selected style
        styleIndex === 1 ? (
          // Style 1: Neon Cyan
          <button
            type="button"
            onClick={connect}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-cyan-glow/60 bg-[#0e2247]/50 text-cyan-glow px-3.5 py-[9px] text-[13.5px] font-black whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-glow/20 hover:text-white hover:border-cyan-glow/90"
            style={{
              boxShadow: "0 0 16px rgba(150,245,255,0.45), inset 0 0 8px rgba(150,245,255,0.2)",
              textShadow: "0 0 8px rgba(150,245,255,0.7)",
            }}
          >
            <SpotifyMark />
            <span className="hidden sm:inline">Connect Spotify</span>
            <span className="sm:hidden">Spotify</span>
          </button>
        ) : styleIndex === 2 ? (
          // Style 2: Floating Cloud
          <button
            type="button"
            onClick={connect}
            className="anim-floaty-sm flex cursor-pointer items-center gap-2 rounded-full border border-blush/40 bg-white/8 text-blush px-3.5 py-[9px] text-[13.5px] font-black whitespace-nowrap shadow-[0_0_14px_rgba(255,182,217,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blush/20 hover:text-white hover:border-blush/60 hover:shadow-[0_0_20px_rgba(255,182,217,0.45)]"
          >
            <SpotifyMark />
            <span className="hidden sm:inline">Connect Spotify</span>
            <span className="sm:hidden">Spotify</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp"
              alt=""
              className="w-5 h-4 object-contain opacity-75 group-hover:opacity-100 transition-opacity"
            />
          </button>
        ) : styleIndex === 3 ? (
          // Style 3: Cloud Shaped
          <button
            type="button"
            onClick={connect}
            className="relative flex cursor-pointer items-center justify-center text-[13px] font-black whitespace-nowrap text-[#0e2247] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{ width: 145, height: 42 }}
          >
            <svg
              viewBox="0 0 120 40"
              className="absolute inset-0 w-full h-full filter drop-shadow(0 2px 5px rgba(205,185,247,0.35)) transition-all hover:drop-shadow(0 4px 9px rgba(150,245,255,0.55))"
            >
              <path
                d="M20,34 C13,34 8,29 8,22 C8,15 15,11 22,13 C27,6 42,3 52,9 C62,3 82,4 89,11 C96,9 106,14 106,22 C106,28 101,34 94,34 Z"
                fill="#ffffff"
                className="transition-colors hover:fill-[#ecfaff]"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-1.5">
              <SpotifyMark size={14} />
              <span>Connect</span>
            </span>
          </button>
        ) : (
          // Style 0: Glassy Lavender (Default)
          <button
            type="button"
            onClick={connect}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-lavender/40 bg-white/8 text-lavender px-3.5 py-[9px] text-[13.5px] font-black whitespace-nowrap shadow-[0_0_14px_rgba(205,185,247,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-lavender/20 hover:text-white hover:border-lavender/60 hover:shadow-[0_0_20px_rgba(205,185,247,0.45)]"
          >
            <SpotifyMark />
            <span className="hidden sm:inline">Connect Spotify</span>
            <span className="sm:hidden">Spotify</span>
          </button>
        )
      ) : (
        // Render connected button based on selected style
        styleIndex === 1 ? (
          // Style 1: Neon Cyan
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-cyan-glow/70 bg-cyan-glow/20 text-white px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap transition-all duration-200 hover:bg-cyan-glow/30"
            style={{
              boxShadow: "0 0 16px rgba(150,245,255,0.55), inset 0 0 8px rgba(255,255,255,0.15)",
              textShadow: "0 0 8px rgba(255,255,255,0.85)",
            }}
          >
            <SpotifyMark />
            <span className="hidden md:inline">Focus sounds</span>
            <Equalizer />
          </button>
        ) : styleIndex === 2 ? (
          // Style 2: Floating Cloud
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="anim-floaty-sm flex cursor-pointer items-center gap-2 rounded-full border border-blush/40 bg-blush/16 text-white px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap shadow-[0_0_14px_rgba(255,182,217,0.35)] transition-all duration-200 hover:bg-blush/25"
          >
            <SpotifyMark />
            <span className="hidden md:inline">Focus sounds</span>
            <Equalizer />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/clouds-sunset/cutout-cloud-sunset-1-03.webp"
              alt=""
              className="w-5 h-4 object-contain opacity-75"
            />
          </button>
        ) : styleIndex === 3 ? (
          // Style 3: Cloud Shaped
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="relative flex cursor-pointer items-center justify-center text-[13px] font-black whitespace-nowrap text-[#0e2247] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{ width: 145, height: 42 }}
          >
            <svg
              viewBox="0 0 120 40"
              className="absolute inset-0 w-full h-full filter drop-shadow(0 2px 5px rgba(150,245,255,0.4)) transition-all hover:drop-shadow(0 4px 9px rgba(150,245,255,0.6))"
            >
              <path
                d="M20,34 C13,34 8,29 8,22 C8,15 15,11 22,13 C27,6 42,3 52,9 C62,3 82,4 89,11 C96,9 106,14 106,22 C106,28 101,34 94,34 Z"
                fill="#96f5ff"
                className="transition-colors hover:fill-[#b4f8ff]"
              />
            </svg>
            <span className="relative z-10 flex items-center gap-1.5">
              <SpotifyMark size={14} />
              <span>Focus</span>
              <Equalizer />
            </span>
          </button>
        ) : (
          // Style 0: Glassy Lavender (Default)
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-cyan-glow/45 bg-cyan-glow/10 text-cyan-glow px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap shadow-[0_0_12px_rgba(150,245,255,0.15)] transition-all duration-200 hover:bg-cyan-glow/20 hover:text-white hover:border-cyan-glow/70 hover:shadow-[0_0_18px_rgba(150,245,255,0.35)]"
          >
            <SpotifyMark />
            <span className="hidden md:inline">Focus sounds</span>
            <Equalizer />
          </button>
        )
      )}

      {/* The panel + embed. Once connected it stays mounted (just hidden when
          the panel is closed) so playback survives navigation and toggling. */}
      {connected && (
        <div
          className="absolute"
          style={{
            top: "calc(100% + 10px)",
            right: 0,
            zIndex: 80,
            width: "min(340px, calc(100vw - 24px))",
            opacity: open ? 1 : 0,
            visibility: open ? "visible" : "hidden",
            transform: open ? "translateY(0)" : "translateY(-6px)",
            transition: "opacity .2s ease, transform .2s ease, visibility .2s",
            background: "rgba(20, 17, 60, 0.96)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(150, 245, 255, 0.28)",
            borderRadius: 18,
            padding: 14,
            boxShadow: "0 0 34px rgba(150, 245, 255, 0.14), 0 28px 60px rgba(8, 6, 30, 0.55)",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <SpotifyMark size={16} />
              <span style={{ fontWeight: 900, fontSize: 13, color: "#96f5ff" }}>Focus sounds</span>
            </div>
            <button
              type="button"
              onClick={disconnect}
              className="cursor-pointer transition-colors hover:text-white"
              style={{ background: "none", border: "none", color: "rgba(150, 245, 255, 0.6)", fontWeight: 800, fontSize: 12 }}
            >
              Disconnect
            </button>
          </div>
          <iframe
            title="Spotify focus playlist"
            src={EMBED_SRC}
            width="100%"
            height={352}
            frameBorder={0}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{ borderRadius: 12, border: "none", display: "block" }}
          />

          {/* Button Theme Selector */}
          <div style={{ marginTop: 12, borderTop: "1px solid rgba(150, 245, 255, 0.2)", paddingTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.5, color: "#96f5ff", textTransform: "uppercase", marginBottom: 6 }}>
              Button Theme
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {BUTTON_STYLES.map((style, idx) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => changeStyle(idx)}
                  className={`cursor-pointer text-left px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                    styleIndex === idx
                      ? "bg-cyan-glow/20 text-white border border-cyan-glow/50"
                      : "bg-white/4 text-cyan-glow/70 border border-transparent hover:bg-white/8 hover:text-cyan-glow"
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(150, 245, 255, 0.5)", marginTop: 10, lineHeight: 1.5 }}>
            Keeps playing while you move around the site.
          </div>
        </div>
      )}
    </div>
  );
}
