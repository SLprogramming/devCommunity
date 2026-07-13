import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    preloadEntriesOnStart: false,
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
