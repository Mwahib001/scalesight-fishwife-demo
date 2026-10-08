import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production start serves a private snapshot, never the mutable build directory.
  distDir: process.env.FISHWIFE_RUNTIME_DIR || ".next",
  // deploymentId: process.env.NEXT_DEPLOYMENT_ID || undefined,
};

export default nextConfig;
