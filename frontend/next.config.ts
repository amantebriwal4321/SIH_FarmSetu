import type { NextConfig } from "next";

// Same-origin proxy (mirrors StackRadar): the browser calls its own origin
// /api/v1/* and Next forwards it to the FastAPI backend. No CORS to configure.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${BACKEND_ORIGIN}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
