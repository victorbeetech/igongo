// Next.js settings for the Igongo web portal. Every page is built ahead of
// time from the screen inventory, so the portal can be served from Cloudflare.

import type { NextConfig } from "next";

const config: NextConfig = {
  // Strict React checks in development catch unsafe effects early.
  reactStrictMode: true,
  // No "X-Powered-By" header: it tells attackers what we run.
  poweredByHeader: false,
  // The shared design tokens package is TypeScript source, so Next compiles it.
  transpilePackages: ["@igongo/design-tokens"],
};

export default config;
