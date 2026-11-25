// Browser checks of the web portal (Playwright), run against the static
// preview build (`pnpm build:preview`), which draws every page from the `#`
// address. Two kinds of check live in e2e/:
//   a11y.spec.ts    axe accessibility check of every page, light and dark
//   visual.spec.ts  screenshots of the key pages, compared with saved images
// Run with `pnpm test:e2e`; save new screenshots with `pnpm test:e2e --update-snapshots`.

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  // Screenshots are saved per test file, without the platform in the name;
  // they are made on Linux (as in CI), so update them on Linux only.
  snapshotPathTemplate: "{testDir}/screenshots/{arg}{ext}",
  timeout: 10 * 60 * 1000,
  reporter: "list",
  use: { baseURL: "http://localhost:4173", viewport: { width: 1280, height: 800 }, trace: "off" },
  // Serves the static preview from out/ while the tests run.
  webServer: { command: "node e2e/support/serve.mjs", url: "http://localhost:4173/index.html", reuseExistingServer: true },
});
