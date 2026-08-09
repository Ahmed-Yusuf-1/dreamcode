"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import GuidePath from "./GuidePath";
import { AppearanceController } from "@/lib/appearance";

// Focused, full-screen flows that should not show the global nav.
const HIDE_NAV = new Set(["/login", "/signup", "/start"]);
// Pages that handle their own top spacing (e.g. custom layout, sticky sub-headers)
const NO_SPACER = new Set(["/journey", "/peaks"]);

/**
 * Renders the persistent global nav on every page (it lives here, in the root
 * layout, so it never remounts on navigation — the Spotify player keeps
 * playing). The hero on /home sits under a transparent nav, so it gets no top
 * spacer; every other page is pushed down by the nav's height.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const hideNav = HIDE_NAV.has(pathname);
  const isHome = pathname === "/";
  const noSpacer = NO_SPACER.has(pathname);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#121037] focus:text-[#ffe7f4] focus:border-2 focus:border-[#ff7ad9] focus:rounded-md focus:font-black focus:shadow-[0_0_15px_rgba(255,122,217,0.5)] focus:outline-none"
      >
        Skip to content
      </a>
      {!hideNav && <NavBar isHome={isHome} />}
      {/* tabIndex -1 so the skip link moves keyboard focus here, not just the viewport */}
      <main id="main-content" tabIndex={-1} style={{ paddingTop: !hideNav && !isHome && !noSpacer ? "var(--nav-h)" : 0, outline: "none" }}>
        {children}
      </main>
      <GuidePath />
      <AppearanceController />
    </>
  );
}
