// Copies the brand kit files the web needs (logos, fonts, card, favicons,
// manifest icons and the sharing image) from packages/brand into
// public/brand, before every dev run and build. The copies are not committed:
// packages/brand stays the only source (brand rule 1).

import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Step 1: work out the folders from this script's own place in the repo.
const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const brand = join(web, "../../packages/brand");
const out = join(web, "public/brand");

// Step 2: start clean, so a file removed from the kit is removed here too.
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Step 3: copy only what the web uses.
for (const folder of ["logo/mark", "logo/horizontal", "logo/stacked", "logo/spiral", "fonts", "cards/portrait-black", "web", "pattern"]) {
  cpSync(join(brand, folder), join(out, folder), { recursive: true, filter: (src) => !src.endsWith(".pdf") });
}
