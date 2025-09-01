import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "8q9jru87w2.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
