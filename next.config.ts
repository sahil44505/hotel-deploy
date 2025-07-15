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
};
export default nextConfig;
