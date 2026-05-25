import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  outputFileTracingIncludes: {
    "/privacy": ["./privacy/**/*.md"],
  },
}

export default nextConfig
