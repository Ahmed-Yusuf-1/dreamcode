"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import SiteFooter from "./SiteFooter";
import GuidePath from "./GuidePath";
import GuestMergePrompt from "./GuestMergePrompt";
import BadgeToast from "./BadgeToast";
import CatalogProvider from "./CatalogProvider";
import { AppearanceController } from "@/lib/appearance";
import type { Catalog } from "@/lib/catalog";

// Focused, full-screen flows that should not show the global nav.
const HIDE_NAV = new Set(["/login", "/signup", "/start"]);

/**
 * Renders the persistent global nav on every page (it lives here, in the root
 * layout, so it never remounts on navigation and the Spotify player keeps
 * playing). The hero on /home sits under a transparent nav, so it gets no top
 * spacer; every other page is pushed down by the nav's height.
 */
export default function SiteChrome({ catalog, children }: { catalog: Catalog; children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const hideNav = HIDE_NAV.has(pathname);
  const isHome = pathname === "/";

  return (
    <CatalogProvider catalog={catalog}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#121037] focus:text-[#ffe7f4] focus:border-2 focus:border-[#ff7ad9] focus:rounded-md focus:font-black focus:shadow-[0_0_15px_rgba(255,122,217,0.5)] focus:outline-none"
      >
        Skip to content
      </a>
      {!hideNav && <NavBar isHome={isHome} />}
      {/* tabIndex -1 so the skip link moves keyboard focus here, not just the viewport */}
      <main
        id="main-content"
        tabIndex={-1}
        style={{ paddingTop: !hideNav && !isHome ? "var(--nav-h)" : 0, outline: "none", flex: "1 0 auto" }}
      >
        {children}
      </main>
      {!hideNav && <SiteFooter />}
      <GuidePath />
      <GuestMergePrompt />
      <BadgeToast />
      <AppearanceController />
    </CatalogProvider>
  );
}
