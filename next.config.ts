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
};

export default nextConfig;
