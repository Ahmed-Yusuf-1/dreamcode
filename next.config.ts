import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "192.168.1.71",
    "192.168.1.71:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "localhost",
    "localhost:3000"
  ],
};

export default nextConfig;
