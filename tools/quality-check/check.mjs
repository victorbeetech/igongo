#!/usr/bin/env node
/**
 * The checkable quality rules (docs/QUALITY-RULES.md), run in CI on every
 * pull request. It reads the tracked source files and fails, listing each
 * file and line, when it finds:
 *
 *   rule 2  a skipped or focused test (.skip, .only, xit, skip: true);
 *   rule 5  an empty catch block (an error swallowed with nothing done);
 *   rule 6  a TODO, FIXME or stub marker in sign-in, auth, payments or permissions code;
 *   rule 7  a log line that prints a password, token, secret or key, or a
 *           real secret written into a file (private keys, live API keys);
 *   rule 3  a dependency without a fixed version range ("*", "latest", a URL or a git link).
 *
 * Usage: node tools/quality-check/check.mjs   (from the repository root)
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Step 1: the tracked files (generated, vendored and test-fixture folders left out).
const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter((f) => f && !/(^|\/)(node_modules|build|dist|\.next|\.dart_tool)\//.test(f) && !/\.g\.(dart|ts)$/.test(f));

const code = files.filter((f) => /\.(ts|tsx|mjs|js|dart)$/.test(f) && !f.startsWith("tools/quality-check/"));
const tests = code.filter((f) => /(^|\/)test\/|\.test\.(ts|tsx)$|_test\.dart$/.test(f));
/** Sign-in, auth, payments and permissions code (rule 6). */
const sensitive = code.filter((f) => /(users-login|users_login|roles-permissions|roles_permissions|payments|m04|auth|session)/.test(f));

/** Each problem found: file, line number and which rule. */
const problems = [];

/** Adds a problem for every line of [file] that matches [pattern]. */
function scan(file, pattern, rule) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (pattern.test(line)) problems.push(`${file}:${i + 1}  ${rule}: ${line.trim()}`);
    });
}

// Step 2: rule 2, skipped or focused tests.
for (const f of tests) scan(f, /\b(it|test|describe|group)\.(skip|only)\(|\bx(it|describe)\(|\bskip:\s*true\b|\btestWidgets\.skip\b/, "rule 2 (skipped or focused test)");

// Step 3: rule 5, empty catch blocks (also `catch (_) {}` in Dart), across lines too.
for (const f of code) {
  const text = readFileSync(f, "utf8");
  const empty = /catch\s*(\([^)]*\))?\s*\{\s*\}/g;
  for (const m of text.matchAll(empty)) {
    const line = text.slice(0, m.index).split("\n").length;
    problems.push(`${f}:${line}  rule 5 (empty catch, error swallowed)`);
  }
}

// Step 4: rule 6, TODO or stub markers where security lives.
for (const f of sensitive) scan(f, /\b(TODO|FIXME|HACK)\b|[Nn]ot implemented yet|throw new Error\(["']stub/, "rule 6 (TODO or stub in auth, payments or permissions)");

// Step 5: rule 7, logging a secret.
for (const f of code) scan(f, /(console\.\w+|logger\.\w+|log\.\w+|debugPrint|print)\s*\(.*\b(password|passwd|secret|token|apiKey|api_key|privateKey)\b(?!\s*:\s*["'`]?\*)/i, "rule 7 (a secret may be logged)");

// Step 5b: rule 7, secrets written into any tracked text file.
const SECRET = /\bMII[A-Za-z0-9+/]{60,}|\bAKIA[0-9A-Z]{16}\b|\bsk_live_[0-9a-zA-Z]{16,}|\bghp_[0-9A-Za-z]{30,}|\bxox[abp]-[0-9A-Za-z-]{10,}|\bAIza[0-9A-Za-z_-]{35}\b|\bFLWSECK-[0-9a-zA-Z]{10,}/;
for (const f of files.filter((x) => /\.(ts|tsx|mjs|js|dart|json|jsonc|ya?ml|md|env|txt|plist|xml|gradle|kts|toml|sh|py)$/.test(x) && !x.startsWith("tools/quality-check/"))) {
  scan(f, SECRET, "rule 7 (a secret is written in the repository)");
}

// Step 6: rule 3, dependencies with no fixed version.
for (const f of files.filter((x) => x.endsWith("package.json"))) {
  const pkg = JSON.parse(readFileSync(f, "utf8"));
  for (const group of ["dependencies", "devDependencies", "peerDependencies"]) {
    for (const [name, version] of Object.entries(pkg[group] ?? {})) {
      if (version === "*" || version === "latest" || /^(https?:|git\+|github:)/.test(version)) problems.push(`${f}  rule 3 (unpinned dependency): ${name}@${version}`);
    }
  }
}

// Step 7: the result.
if (problems.length) {
  console.error(`Quality rules: ${problems.length} problem(s)\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`Quality rules: ${code.length} code files and ${tests.length} test files checked, no problems.`);
