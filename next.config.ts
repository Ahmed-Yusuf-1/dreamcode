import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  // Baseline security headers on every response. (A strict Content-Security-Policy
  // is a follow-on: the app relies on inline styles and loads the Spotify SDK +
  // Supabase, so a CSP needs careful per-source allowances and testing.)
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
        ],
      },
    ];
  },
};

export default nextConfig;
