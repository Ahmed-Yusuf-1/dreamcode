"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

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
      {!hideNav && <NavBar isHome={isHome} />}
      <div style={{ paddingTop: !hideNav && !isHome && !noSpacer ? "var(--nav-h)" : 0 }}>{children}</div>
    </>
  );
}
