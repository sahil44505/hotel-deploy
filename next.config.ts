import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows images from any domain
      },
      {
        protocol: "http", // Also allow non-secure HTTP images if needed
        hostname: "**",
      },
    ],
  },
  reactStrictMode: false,

  // ✅ Disable ESLint checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
