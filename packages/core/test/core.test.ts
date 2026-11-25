/** Tests for the shared core: permission matching, secret encryption and errors. */

import { describe, expect, it } from "vitest";
import { AppError, hasPermission, permissionMatches, SecretBox, sha256Hex, toBase64 } from "../src";

describe("permissionMatches", () => {
  it("matches exact keys, wildcards per part and the super admin star", () => {
    expect(permissionMatches("pool.passes.view", "pool.passes.view")).toBe(true);
    expect(permissionMatches("pool.*.view", "pool.passes.view")).toBe(true);
    expect(permissionMatches("pool.*.*", "pool.passes.delete")).toBe(true);
    expect(permissionMatches("*", "anything.at.all")).toBe(true);
  });
  it("refuses other modules, other actions and malformed keys", () => {
    expect(permissionMatches("pool.*.view", "pool.passes.edit")).toBe(false);
    expect(permissionMatches("pool.*.view", "spa.passes.view")).toBe(false);
    expect(permissionMatches("pool.view", "pool.passes.view")).toBe(false);
    expect(hasPermission([], "pool.passes.view")).toBe(false);
  });
});

describe("SecretBox", () => {
  const key = toBase64(crypto.getRandomValues(new Uint8Array(32)));
  it("seals and opens a secret, with a new IV each time", async () => {
    const box = await SecretBox.fromBase64Key(key);
    const a = await box.seal("demo-key");
    expect(a).not.toContain("demo-key");
    expect(a).not.toBe(await box.seal("demo-key"));
    expect(await box.open(a)).toBe("demo-key");
  });
  it("refuses a missing key and a value made with another key", async () => {
    await expect(SecretBox.fromBase64Key(undefined)).rejects.toBeInstanceOf(AppError);
    const other = await SecretBox.fromBase64Key(toBase64(crypto.getRandomValues(new Uint8Array(32))));
    const sealed = await (await SecretBox.fromBase64Key(key)).seal("x");
    await expect(other.open(sealed)).rejects.toThrow();
  });
});

describe("sha256Hex and AppError", () => {
  it("hashes to known hex and maps codes to statuses", async () => {
    expect(await sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(new AppError("permission_denied", "no").status).toBe(403);
  });
});

describe("hashPassword", () => {
  it("verifies the right password only", async () => {
    const { hashPassword, verifyPassword } = await import("../src");
    const stored = await hashPassword("Correct horse 1");
    expect(stored.startsWith("pbkdf2-sha256$100000$")).toBe(true);
    expect(await verifyPassword(stored, "Correct horse 1")).toBe(true);
    expect(await verifyPassword(stored, "wrong")).toBe(false);
    expect(await verifyPassword("garbage", "x")).toBe(false);
  });
});
