/**
 * Users & Login on a real Postgres (PGlite) with the real migrations and a
 * real Better Auth instance: sign-up, sign-in, the method switches (system
 * and per role), account locks, PINs, sessions and the first admin set-up.
 */

import { describe, expect, it } from "vitest";
import { createStaffAccount } from "../src/application/use-cases/create-staff-account";
import { claimFirstSuperAdmin, setupNeeded } from "../src/application/use-cases/claim-first-super-admin";
import { setAccountStatus } from "../src/application/use-cases/manage-accounts";
import { updateLoginMethod } from "../src/application/use-cases/login-methods";
import { cookieOf, testAuth } from "./helpers";

const ann = { name: "Ann Guest", email: "ann@example.com", password: "Correct horse 1" };

describe("email and password", () => {
  it("signs up a client with the guest role, signs in and records it", async () => {
    const t = await testAuth();
    const up = await t.call("/sign-up/email", ann);
    expect(up.status).toBe(200);
    const { user } = (await up.json()) as { user: { id: string } };
    expect(t.deps.access.held.get(user.id)).toEqual(["guest"]);
    const res = await t.call("/sign-in/email", { email: ann.email, password: ann.password });
    expect(res.status).toBe(200);
    const session = await (await t.call("/get-session", undefined, cookieOf(res))).json();
    expect((session as { user: { email: string } }).user.email).toBe(ann.email);
    expect(t.audit.map((e) => e.action)).toEqual(expect.arrayContaining(["account.created", "login.succeeded"]));
  });

  it("records a wrong password as a failed sign-in", async () => {
    const t = await testAuth();
    await t.call("/sign-up/email", ann);
    expect((await t.call("/sign-in/email", { email: ann.email, password: "nope-nope-nope" })).status).toBe(401);
    expect(t.audit.at(-1)).toMatchObject({ action: "login.failed", recordId: ann.email });
  });
});

describe("the super admin's switches", () => {
  it("refuses a switched-off method on every path", async () => {
    const t = await testAuth();
    await t.call("/sign-up/email", ann);
    await updateLoginMethod(t.deps.settings, { actorId: "admin", audit: t.deps.audit, now: new Date() }, "email_password", { enabled: false });
    const res = await t.call("/sign-in/email", { email: ann.email, password: ann.password });
    expect(res.status).toBe(403);
    expect(((await res.json()) as { code: string }).code).toBe("METHOD_DISABLED");
  });

  it("limits a method to some roles", async () => {
    const t = await testAuth();
    await t.call("/sign-up/email", ann);
    await updateLoginMethod(t.deps.settings, { actorId: "admin", audit: t.deps.audit, now: new Date() }, "email_password", { allowedRoleKeys: ["chef"] });
    expect((await t.call("/sign-in/email", { email: ann.email, password: ann.password })).status).toBe(403);
  });

  it("refuses self sign-up when the policy says so, and holds new accounts for approval", async () => {
    const t = await testAuth();
    await t.deps.settings.savePolicy({ newAccountsNeedApproval: true });
    const up = await t.call("/sign-up/email", ann);
    expect(up.status).toBe(403); // auto sign-in after sign-up is refused while pending
    expect((await t.deps.accounts.search({ limit: 5, offset: 0 })).items[0]?.status).toBe("pending");
    await t.deps.settings.savePolicy({ allowSelfRegistration: false });
    expect((await t.call("/sign-up/email", { ...ann, email: "bob@example.com" })).status).toBe(403);
  });

  it("keeps Apple and phone codes off by default, and says why", async () => {
    const t = await testAuth();
    const res = await t.call("/phone-number/send-otp", { phoneNumber: "+256700000000" });
    expect(((await res.json()) as { code: string }).code).toBe("METHOD_DISABLED");
  });
});

describe("accounts and sessions", () => {
  it("locking an account signs it out and stops new sign-ins", async () => {
    const t = await testAuth();
    const { user } = (await (await t.call("/sign-up/email", ann)).json()) as { user: { id: string } };
    await t.call("/sign-in/email", { email: ann.email, password: ann.password });
    expect((await t.deps.accounts.sessionsOf(user.id)).length).toBe(2);
    await setAccountStatus(t.deps.accounts, { actorId: "admin", audit: t.deps.audit, now: new Date() }, user.id, "locked");
    expect(await t.deps.accounts.sessionsOf(user.id)).toEqual([]);
    expect((await t.call("/sign-in/email", { email: ann.email, password: ann.password })).status).toBe(403);
  });

  it("an admin-made staff account signs in with its password and gets no guest role", async () => {
    const t = await testAuth();
    const writer = (await t.auth.$context).internalAdapter;
    const { id } = await createStaffAccount(writer, { actorId: "admin", audit: t.deps.audit, now: new Date() }, { name: "Sam Chef", email: "sam@igongo.test", password: "Kitchen pass 9" });
    expect(t.deps.access.held.get(id)).toBeUndefined();
    expect((await t.call("/sign-in/email", { email: "sam@igongo.test", password: "Kitchen pass 9" })).status).toBe(200);
    expect((await t.deps.accounts.get(id))?.kind).toBe("staff");
  });
});

describe("PIN on a trusted device", () => {
  it("sets a PIN, signs in with it and locks after five wrong tries", async () => {
    const t = await testAuth();
    const up = await t.call("/sign-up/email", ann);
    const { user } = (await up.json()) as { user: { id: string } };
    const device = "device-0001-abc";
    expect((await t.call("/pin/set", { deviceId: device, pin: "1111" }, cookieOf(up))).status).toBe(400);
    expect((await t.call("/pin/set", { deviceId: device, pin: "4826" }, cookieOf(up))).status).toBe(200);
    expect((await t.call("/pin/sign-in", { userId: user.id, deviceId: device, pin: "4826" })).status).toBe(200);
    for (let i = 0; i < 5; i++) await t.call("/pin/sign-in", { userId: user.id, deviceId: device, pin: "0000" });
    expect((await t.call("/pin/sign-in", { userId: user.id, deviceId: device, pin: "4826" })).status).toBe(429);
  });
});

describe("first super admin set-up", () => {
  it("lets only the owner with a verified email claim it, once", async () => {
    const t = await testAuth();
    const { user } = (await (await t.call("/sign-up/email", { ...ann, email: "owner@example.com" })).json()) as { user: { id: string } };
    const deps = { accounts: t.deps.accounts, access: t.deps.access, bootstrapEmail: "Owner@example.com" };
    // Not verified yet (password sign-up): refused.
    await expect(claimFirstSuperAdmin(deps, user.id)).rejects.toThrow(/owner/);
    await t.client.exec(`update users_login."user" set email_verified = true`);
    await claimFirstSuperAdmin(deps, user.id);
    expect(t.deps.access.held.get(user.id)).toContain("super-admin");
    expect(await setupNeeded(deps)).toBe(false);
    await expect(claimFirstSuperAdmin(deps, user.id)).rejects.toThrow(/already/);
  });
});
