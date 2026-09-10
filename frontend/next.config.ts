import type { NextConfig } from "next";

// Single self-contained app — all data/logic is in-process (src/lib/engine),
// so there is no backend to proxy to. Deploys to Vercel with zero config
// (Root Directory = frontend).
const nextConfig: NextConfig = {};

export default nextConfig;
