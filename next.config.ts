import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["mapbox-gl"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
