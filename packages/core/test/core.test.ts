/** Tests for the shared core: permission matching, secret encryption and errors. */

import type { Actor } from "@igongo/contracts/users-login";
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

describe("scopes and hotel dates", () => {
  /** A caller holding [grants]. */
  const actorWith = (grants: { key: string; scope: "all" | "team" | "own" }[]): Actor => ({
    userId: "u",
    sessionId: "s",
    name: "N",
    email: "e",
    access: { userId: "u", roles: [], permissions: grants, homeTiles: [], menu: [], isStaff: true },
  });

  it("takes the widest scope across roles and maps it to staff records", async () => {
    const { scopeOf, staffScope, scopeReaches } = await import("../src");
    const supervisor = actorWith([{ key: "attendance.*.view", scope: "own" }, { key: "attendance.*.view", scope: "team" }]);
    expect(scopeOf(supervisor, "attendance.records.view")).toBe("team");
    expect(scopeOf(supervisor, "attendance.records.edit")).toBeNull();
    const scope = staffScope(supervisor, "attendance.records.view", { staffId: "st1", department: "kitchen" });
    expect(scope).toEqual({ kind: "department", department: "kitchen" });
    if (!scope) throw new Error("expected a scope");
    expect(scopeReaches(scope, { staffId: "st2", department: "kitchen" })).toBe(true);
    expect(scopeReaches(scope, { staffId: "st3", department: "pool" })).toBe(false);
    expect(staffScope(actorWith([{ key: "*", scope: "all" }]), "x.y.z", null)).toEqual({ kind: "all" });
    expect(staffScope(actorWith([{ key: "attendance.*.view", scope: "own" }]), "attendance.records.view", null)).toBeNull();
  });

  it("turns over the hotel's day at Kampala midnight", async () => {
    const { hotelDate, hotelTime } = await import("../src");
    expect(hotelDate(new Date("2026-11-25T20:59:00Z"))).toBe("2026-11-25");
    expect(hotelDate(new Date("2026-11-25T21:00:00Z"))).toBe("2026-11-26");
    expect(hotelTime(new Date("2026-11-25T05:15:00Z"))).toBe("08:15");
  });
});
