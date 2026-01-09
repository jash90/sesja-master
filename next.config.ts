import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
