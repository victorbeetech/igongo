// After `pnpm build:preview`: tidies the static preview in `out/` so it can be
// hosted from any folder or host. It moves the scripts to `app/_next` (where
// next.config.ts points them), removes files whose names start with "_" that
// the one-page preview never uses, and makes the brand file addresses
// ("/brand/...") relative. Changes only `out/`.

import { mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Step 1: the export folder, next to this script's app.
const out = join(dirname(fileURLToPath(import.meta.url)), "../out");

// Step 1b: scripts under app/_next, and no top-level "_" names left behind.
mkdirSync(join(out, "app"), { recursive: true });
renameSync(join(out, "_next"), join(out, "app/_next"));
for (const name of readdirSync(out)) {
  if (name.startsWith("_") || name === "404.html") rmSync(join(out, name), { recursive: true, force: true });
}

/** Every file under [dir]. */
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// Step 2: HTML and scripts run from the page, so "./" is the page's folder.
// Stylesheets resolve from their own folder, so they get a path back up to it.
for (const file of walk(out)) {
  let prefix;
  if (/\.(html|js|txt)$/.test(file)) prefix = "./";
  else if (file.endsWith(".css")) prefix = relative(dirname(file), out) + "/";
  else continue;
  const text = readFileSync(file, "utf8");
  // Brand addresses become relative; a raw U+FFFD character (it appears in
  // string literals of a bundled library) is written as its "\uFFFD" escape,
  // which means the same to JavaScript but survives hosts that reject it.
  // In pages and scripts only quoted addresses change ("..." and `...`), never a
  // class name such as bg-[url('/brand/...')], which must keep matching its CSS rule.
  const before = file.endsWith(".css") ? "[\"'(]" : '["`]';
  let fixed = text.replace(new RegExp(`(${before})\\/(brand\\/|manifest\\.webmanifest)`, "g"), `$1${prefix}$2`);
  if (file.endsWith(".js")) fixed = fixed.replaceAll("\uFFFD", "\\uFFFD");
  if (fixed !== text) writeFileSync(file, fixed);
}
