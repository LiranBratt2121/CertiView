import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    matcher: ["/api/:path*"], // apply only to API routes
};

export default nextConfig;
