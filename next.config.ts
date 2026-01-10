import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
