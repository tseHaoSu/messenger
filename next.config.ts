import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
