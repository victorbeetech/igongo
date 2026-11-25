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
  // The static preview (`pnpm build:preview`) is plain files in `out/`, one page
  // plus its scripts, so it can be hosted anywhere as a review link. Its assets
  // use relative addresses ("./app/_next/...") so the files work from any
  // folder; hosts that hide names starting with "_" still serve "app/".
  ...(process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1" ? { output: "export" as const, assetPrefix: "./app", images: { unoptimized: true } } : {}),
};

export default config;
