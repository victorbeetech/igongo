// Unit tests for the web password match rule. Run with `pnpm test:unit`.
// Uses Node's built-in test runner, so no extra test package is needed.

import { test } from "node:test";
import assert from "node:assert/strict";
import { PASSWORDS_DIFFER_MESSAGE, passwordsMatch } from "../src/shared/validation/passwordsMatch.ts";

test("identical passwords match", () => {
  assert.equal(passwordsMatch("Igongo2026", "Igongo2026"), true);
});

test("a different second password does not match", () => {
  assert.equal(passwordsMatch("Igongo2026", "Igongo2027"), false);
});

test("the check is exact: case and spaces count", () => {
  assert.equal(passwordsMatch("Igongo2026", "igongo2026"), false);
  assert.equal(passwordsMatch("Igongo2026", "Igongo2026 "), false);
});

test("an empty confirm box does not match a set password", () => {
  assert.equal(passwordsMatch("Igongo2026", ""), false);
});

test("the message says the two passwords differ", () => {
  assert.equal(PASSWORDS_DIFFER_MESSAGE, "The two passwords are not the same.");
});
