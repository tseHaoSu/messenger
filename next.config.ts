import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "api.dicebear.com" },
      { hostname: "img.clerk.com" },
      { hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
