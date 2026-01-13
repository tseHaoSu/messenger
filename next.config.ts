import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  // This creates a self-contained build with only necessary dependencies
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "api.dicebear.com" },
      { hostname: "img.clerk.com" },
      { hostname: "picsum.photos" },
      { hostname: "*.convex.cloud" },
    ],
  },
};

export default nextConfig;
