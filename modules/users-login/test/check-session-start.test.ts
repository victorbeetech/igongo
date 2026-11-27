/**
 * The session-start rules as pure use-case tests: a social sign-in (Google or
 * Apple) must never start a session for the super admin, and the super admin
 * keeps its email and password route. No database: the account store, the
 * access reader and the settings are small fakes.
 */

import { describe, expect, it } from "vitest";
import { SUPER_ADMIN_ROLE_KEY } from "@igongo/contracts/roles-permissions";
import { checkSessionStart, type SessionStartDeps } from "../src/application/use-cases/check-session-start";
import { isSocialRequestPath } from "../src/domain/method-of-request";

/** Builds the fake dependencies for one account with the given role keys and 2-step state. */
function depsFor(roleKeys: string[], twoFactorEnabled: boolean): SessionStartDeps {
  const account = { id: "user_1", email: "owner@example.com", kind: "staff", status: "active", twoFactorEnabled, emailVerified: true };
  return {
    accounts: { get: async () => account } as unknown as SessionStartDeps["accounts"],
    access: { profileFor: async () => ({ roles: roleKeys.map((key) => ({ key })) }) } as unknown as SessionStartDeps["access"],
    settings: {
      method: async () => ({ enabled: true }),
      policy: async () => ({ twoFactorForSensitiveRoles: true, sensitiveRoleKeys: [] }),
    } as unknown as SessionStartDeps["settings"],
    bootstrapEmail: undefined,
  };
}

const web = "app" as const;

describe("social sign-in never starts a super admin session", () => {
  it("refuses Google for the super admin, with 2-step on", async () => {
    await expect(checkSessionStart(depsFor([SUPER_ADMIN_ROLE_KEY], true), "user_1", "google", "app", { social: true })).rejects.toMatchObject({ code: "method_disabled" });
  });

  it("refuses Apple for the super admin, with 2-step off", async () => {
    await expect(checkSessionStart(depsFor([SUPER_ADMIN_ROLE_KEY], false), "user_1", "apple", "app", { social: true })).rejects.toMatchObject({ code: "method_disabled" });
  });

  it("still refuses a social sign-in when the method could not be read (fails closed)", async () => {
    await expect(checkSessionStart(depsFor([SUPER_ADMIN_ROLE_KEY], true), "user_1", null, "app", { social: true })).rejects.toMatchObject({ code: "method_disabled" });
  });

  it("lets the super admin in with email and password", async () => {
    await expect(checkSessionStart(depsFor([SUPER_ADMIN_ROLE_KEY], true), "user_1", "email_password", web)).resolves.toBeUndefined();
  });

  it("does not block social sign-in for staff without the super admin role", async () => {
    await expect(checkSessionStart(depsFor(["role_cashier"], false), "user_1", "google", "app", { social: true })).resolves.toBeUndefined();
  });
});

describe("Google and Apple are for the app only", () => {
  it("refuses Google and Apple on the web portal, even for a staff member without the super admin role", async () => {
    await expect(checkSessionStart(depsFor(["role_cashier"], false), "user_1", "google", "web", { social: true })).rejects.toMatchObject({ code: "method_disabled" });
    await expect(checkSessionStart(depsFor(["role_cashier"], false), "user_1", "apple", "web", { social: true })).rejects.toMatchObject({ code: "method_disabled" });
  });

  it("still lets Google and Apple work in the app for a staff member without the super admin role", async () => {
    await expect(checkSessionStart(depsFor(["role_cashier"], false), "user_1", "google", "app", { social: true })).resolves.toBeUndefined();
  });

  it("keeps the web password route for staff", async () => {
    await expect(checkSessionStart(depsFor(["role_cashier"], false), "user_1", "email_password", "web")).resolves.toBeUndefined();
  });
});

describe("recognising social requests", () => {
  it("counts the Google and Apple redirect and callback paths as social", () => {
    expect(isSocialRequestPath("/sign-in/social")).toBe(true);
    expect(isSocialRequestPath("/callback/google")).toBe(true);
    expect(isSocialRequestPath("/callback/apple")).toBe(true);
  });

  it("does not count password, code or session paths as social", () => {
    expect(isSocialRequestPath("/sign-in/email")).toBe(false);
    expect(isSocialRequestPath("/api/users/me")).toBe(false);
  });
});
