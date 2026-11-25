// After `pnpm build:preview`: readies the static preview in `out/` for the
// Cloudflare host (wrangler.jsonc). Changes only `out/`. Three steps:
//   1. Copy the response headers (noindex and safety) from cloudflare/_headers.
//   2. Pin page addresses to the site root with <base href="/">, so a page that
//      the SPA fallback serves at a deep path such as /staff/12 still finds its
//      "./app/..." scripts and "./brand/..." files.
//   3. Drop the large PNG logo exports, which no page uses (pages use the SVGs),
//      so each deploy uploads about half as much.

import { copyFileSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The app folder (apps/web) and its export folder.
const app = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(app, "out");

// Step 1: the headers file, which Cloudflare reads from the assets folder.
copyFileSync(join(app, "cloudflare/_headers"), join(out, "_headers"));

// Step 2: every top-level page resolves its relative addresses from the root.
for (const name of readdirSync(out).filter((n) => n.endsWith(".html"))) {
  const file = join(out, name);
  const html = readFileSync(file, "utf8");
  if (!html.includes("<base ")) writeFileSync(file, html.replace("<head>", '<head><base href="/">'));
}

// Step 3: brand/logo/<lockup>/png holds raster exports for print and stores only.
const logos = join(out, "brand/logo");
for (const lockup of readdirSync(logos)) rmSync(join(logos, lockup, "png"), { recursive: true, force: true });
