import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Shipped REPORT-ONLY first (per PLAN.md): the browser reports violations to the
 * console without blocking anything, so we can watch a full walkthrough (JS +
 * Python lessons, Spotify connect, auth) and confirm zero legitimate violations
 * before flipping it to enforcing. To enforce, change the header key below from
 * `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.
 *
 * Why this app cannot use a "strict" (nonce) CSP:
 *  - The JavaScript track runs the learner's code in-browser via `new Function`,
 *    and Pyodide compiles CPython to WebAssembly. Both require `'unsafe-eval'`
 *    (plus `'wasm-unsafe-eval'`) in script-src. This is inherent to an in-browser
 *    code runner. It only ever runs the learner's OWN first-party code.
 *  - The UI leans on inline `style={...}` attributes and CodeMirror's injected
 *    styles, so style-src needs `'unsafe-inline'`.
 *  - Nonces would force every page into dynamic rendering, which would disable
 *    the SSG lesson pages. The documented next.config headers() approach fits.
 *
 * Per-source allowances:
 *  - Spotify Web Playback SDK script + iframe widget: https://sdk.scdn.co
 *  - Pyodide (CPython -> WASM) script + package downloads: https://cdn.jsdelivr.net
 *  - Supabase REST/Auth/Realtime: https + wss on *.supabase.co
 *  - Spotify Web API + accounts + SDK sockets: https/wss on *.spotify.com
 *  - Spotify album / playlist art: *.scdn.co, *.spotifycdn.com
 *  - Spotify embed fallback iframe: https://open.spotify.com
 */
const csp = [
  "default-src 'self'",
  // 'unsafe-eval' + 'wasm-unsafe-eval' are required by the in-browser JS runner
  // (new Function) and Pyodide; 'unsafe-inline' covers Next's bootstrap scripts.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://sdk.scdn.co https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.scdn.co https://*.spotify.com https://*.spotifycdn.com",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.spotify.com wss://*.spotify.com https://cdn.jsdelivr.net",
  "media-src 'self' blob: https://*.scdn.co",
  "frame-src https://open.spotify.com https://sdk.scdn.co",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Only meaningful (and only safe) in production over HTTPS; on http://localhost
  // it would try to upgrade same-origin dev assets. Report-only ignores it anyway.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // Drop the X-Powered-By: Next.js header so we do not advertise the framework
  // version to attackers (cheap version-fingerprint hardening).
  poweredByHeader: false,
  // The TS semantic checker in /api/transpile reads TypeScript's lib .d.ts files
  // at runtime (they are not statically imported), so make sure the serverless
  // trace bundles them - otherwise the checker fails open in production.
  outputFileTracingIncludes: {
    "/api/transpile": ["./node_modules/typescript/lib/lib.*.d.ts"],
  },
  // Origins allowed to talk to the dev server (HMR/assets). Production on
  // dreamcoder.dev does not use this, but it is listed so a tunneled/staging
  // dev session on the domain also works. Localhost stays for normal dev.
  allowedDevOrigins: [
    "192.168.1.71",
    "192.168.1.71:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "localhost",
    "localhost:3000",
    "dreamcoder.dev",
    "www.dreamcoder.dev"
  ],
  // Baseline security headers on every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Anti-clickjacking: the app must not be framed by other sites.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Report-only for now; watch the console, then flip the key to
          // "Content-Security-Policy" to enforce (see the note above).
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
