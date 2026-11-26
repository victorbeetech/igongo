/**
 * The access and security rules (build checklist phase B) on a real Better
 * Auth instance and PGlite: the staff-only web portal, guest sign-up in the
 * app only, no self-chosen roles, tidy emails and names, password rules,
 * lockout, password reset, new-device alerts, account deletion and method
 * removal. The pure rules (request gate, staff match) are tested at the end.
 */

import { describe, expect, it } from "vitest";
import { createStaffAccount } from "../src/application/use-cases/create-staff-account";
import { matchStaffRecord } from "../src/application/use-cases/match-staff-record";
import { DEFAULT_LOGIN_POLICY } from "../src/domain/login-policy";
import { passwordProblem } from "../src/domain/password-rules";
import { requestGate } from "../src/domain/request-gate";
import { surfaceOf } from "../src/domain/request-surface";
import { namesMatch, phonesMatch } from "../src/domain/staff-match";
import { cookieOf, testAuth } from "./helpers";

const ann = { name: "Ann Guest", email: "ann@example.com", password: "Correct horse 1" };
const admin = () => ({ actorId: "admin", audit: { record: async () => {} }, now: new Date() });

/** A staff account made by the super admin, ready to sign in. */
async function staff(t: Awaited<ReturnType<typeof testAuth>>) {
  const writer = (await t.auth.$context).internalAdapter;
  return createStaffAccount(writer, admin(), { name: "Sam Chef", email: "sam@igongo.test", password: "Kitchen pass 9" });
}

describe("the web portal is for staff only", () => {
  it("refuses guest sign-up on the web, and allows it in the app", async () => {
    const t = await testAuth();
    const web = await t.call("/sign-up/email", ann, undefined, { web: true });
    expect(web.status).toBe(403);
    expect(((await web.json()) as { code: string }).code).toBe("STAFF_ONLY");
    expect((await t.call("/sign-up/email", ann)).status).toBe(200);
  });

  it("refuses a guest's sign-in on the web, but lets staff in", async () => {
    const t = await testAuth();
    await t.call("/sign-up/email", ann);
    expect((await t.call("/sign-in/email", { email: ann.email, password: ann.password }, undefined, { web: true })).status).toBe(403);
    expect((await t.call("/sign-in/email", { email: ann.email, password: ann.password })).status).toBe(200);
    await staff(t);
    expect((await t.call("/sign-in/email", { email: "sam@igongo.test", password: "Kitchen pass 9" }, undefined, { web: true })).status).toBe(200);
  });

  it("lets only the owner sign up on the web, and only before the first set-up", async () => {
    const t = await testAuth();
    expect((await t.call("/sign-up/email", { ...ann, email: "owner@example.com" }, undefined, { web: true })).status).toBe(200);
    t.deps.access.held.set("someone", ["super-admin"]);
    expect((await t.call("/sign-up/email", { ...ann, email: "owner@example.com", name: "Again" }, undefined, { web: true })).status).not.toBe(200);
  });

  it("never lets sign-up choose a role or the staff kind", async () => {
    const t = await testAuth();
    const res = await t.call("/sign-up/email", { ...ann, kind: "staff", status: "active", role: "super-admin" });
    if (res.status === 200) {
      const { user } = (await res.json()) as { user: { id: string } };
      expect((await t.deps.accounts.get(user.id))?.kind).toBe("client");
      expect(t.deps.access.held.get(user.id)).toEqual(["guest"]);
    } else {
      // Better Auth refuses fields that are not inputs: just as safe.
      expect(res.status).toBe(400);
      expect((await t.deps.accounts.search({ limit: 5, offset: 0 })).total).toBe(0);
    }
  });
});

describe("real-user details", () => {
  it("lowercases and trims emails on sign-up and sign-in", async () => {
    const t = await testAuth();
    expect((await t.call("/sign-up/email", { ...ann, email: "  Ann@Example.COM " })).status).toBe(200);
    expect((await t.deps.accounts.search({ limit: 1, offset: 0 })).items[0]?.email).toBe("ann@example.com");
    expect((await t.call("/sign-in/email", { email: " ANN@example.com", password: ann.password })).status).toBe(200);
  });

  it("keeps apostrophes and any language's letters in names, safely", async () => {
    const t = await testAuth();
    const name = "Nakato O'Brien-Kizza  Ñandú 'ÉÀ'; drop table users_login.\"user\";--";
    const res = await t.call("/sign-up/email", { ...ann, name });
    const { user } = (await res.json()) as { user: { id: string } };
    expect((await t.deps.accounts.get(user.id))?.name).toBe(name.replace(/\s+/g, " "));
    expect((await t.deps.accounts.search({ limit: 5, offset: 0, text: "O'Brien" })).total).toBe(1);
  });

  it("refuses weak passwords", async () => {
    const t = await testAuth();
    for (const password of ["short1", "onlyletterslong"]) {
      const res = await t.call("/sign-up/email", { ...ann, password });
      expect(((await res.json()) as { code: string }).code).toBe("WEAK_PASSWORD");
    }
  });

  it("locks an email after five wrong passwords, and a good sign-in starts again", async () => {
    const t = await testAuth();
    await t.call("/sign-up/email", ann);
    for (let i = 0; i < 4; i++) await t.call("/sign-in/email", { email: ann.email, password: `Wrong pass ${i}` });
    expect((await t.call("/sign-in/email", { email: ann.email, password: ann.password })).status).toBe(200);
    for (let i = 0; i < 5; i++) await t.call("/sign-in/email", { email: ann.email, password: `Wrong pass ${i}` });
    const locked = await t.call("/sign-in/email", { email: ann.email, password: ann.password });
    expect(locked.status).toBe(429);
    expect(t.audit.map((e) => e.action)).toContain("login.locked_out");
  });

  it("refuses reset links the same way for every address while email is not set up", async () => {
    const t = await testAuth({ emailReady: false });
    await t.call("/sign-up/email", ann);
    const known = await t.call("/request-password-reset", { email: ann.email });
    const unknown = await t.call("/request-password-reset", { email: "nobody@example.com" });
    expect([known.status, unknown.status]).toEqual([503, 503]);
    expect(await known.json()).toEqual(await unknown.json());
  });

  it("resets a password by email: the link works once and signs out other devices", async () => {
    const t = await testAuth();
    const up = await t.call("/sign-up/email", ann);
    expect((await t.call("/request-password-reset", { email: "ANN@example.com " })).status).toBe(200);
    const token = /reset-password\/([^?\s]+)/.exec(t.sent.at(-1)?.message ?? "")?.[1];
    expect(token).toBeTruthy();
    expect((await t.call("/reset-password", { token, newPassword: "New horse pass 2" })).status).toBe(200);
    expect((await t.call("/reset-password", { token, newPassword: "Other horse 3" })).status).toBe(400);
    expect((await (await t.call("/get-session", undefined, cookieOf(up))).json()) as unknown).toBeNull();
    expect((await t.call("/sign-in/email", { email: ann.email, password: "New horse pass 2" })).status).toBe(200);
  });

  it("alerts the person and the super admins when staff sign in on a new device", async () => {
    const t = await testAuth();
    await staff(t);
    const sam = { email: "sam@igongo.test", password: "Kitchen pass 9" };
    await t.call("/sign-in/email", sam, undefined, { userAgent: "Mozilla/5.0 (Windows NT 10.0) Chrome/130.0" });
    await t.call("/sign-in/email", sam, undefined, { userAgent: "Mozilla/5.0 (Windows NT 10.0) Chrome/130.0" });
    expect(t.alerts).toEqual([]);
    await t.call("/sign-in/email", sam, undefined, { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) Safari/604.1" });
    expect(t.alerts).toEqual([expect.stringContaining("sam@igongo.test: New sign-in"), "admins: Sam Chef signed in on a new device: Safari on iPhone."]);
    expect(t.audit.map((e) => e.action)).toContain("login.new_device");
  });

  it("lets a guest delete their account, but not staff, and never removes the last sign-in method", async () => {
    const t = await testAuth();
    const up = await t.call("/sign-up/email", ann);
    expect((await t.call("/unlink-account", { providerId: "credential" }, cookieOf(up))).status).toBe(400);
    expect((await t.call("/delete-user", {}, cookieOf(up))).status).toBe(200);
    await staff(t);
    const sam = await t.call("/sign-in/email", { email: "sam@igongo.test", password: "Kitchen pass 9" });
    expect((await t.call("/delete-user", {}, cookieOf(sam))).status).toBe(403);
  });
});

describe("the staff match", () => {
  const record = { staffId: "stf_1", staffNumber: "IGG-0007", userId: null as string | null, name: "Samuel Okello", phone: "0772 123 456", status: "active" as const };
  const matcher = (linked: string[]) => ({ byStaffNumber: async (n: string) => (n === record.staffNumber ? record : null), linkAccount: async (_s: string, u: string) => void linked.push(u) });

  it("makes a verified guest staff only when name, phone and number match", async () => {
    const t = await testAuth();
    const { user } = (await (await t.call("/sign-up/email", { ...ann, name: "Sam Okello" })).json()) as { user: { id: string } };
    const linked: string[] = [];
    const deps = { accounts: t.deps.accounts, staffRecords: matcher(linked) };
    const input = { userId: user.id, staffNumber: "igg-0007", phone: "+256772123456" };
    // Not verified yet.
    await expect(matchStaffRecord(deps, admin(), input)).rejects.toThrow(/verify/);
    await t.client.exec(`update users_login."user" set email_verified = true`);
    // Wrong phone.
    await expect(matchStaffRecord(deps, admin(), { ...input, phone: "0700000000" })).rejects.toThrow(/do not match/);
    expect(await matchStaffRecord(deps, admin(), input)).toEqual({ staffId: "stf_1" });
    expect((await t.deps.accounts.get(user.id))?.kind).toBe("staff");
    expect(linked).toEqual([user.id]);
  });

  it("matches names with accents and apostrophes, and phones in any format", () => {
    expect(namesMatch("Nakato O’Brien", "nakato obrien")).toBe(true);
    expect(namesMatch("Ann Guest", "Samuel Okello")).toBe(false);
    expect(phonesMatch("+256 772 123 456", "0772123456")).toBe(true);
    expect(phonesMatch("", "0772123456")).toBe(false);
  });
});

describe("the request gate", () => {
  const now = new Date("2026-11-26T12:00:00Z");
  const base = { surface: "web" as const, path: "/api/hr/staff", account: { kind: "staff", email: "sam@igongo.test", twoFactorEnabled: true }, roleKeys: ["hr-manager"], sessionCreatedAt: now, now, ownerSettingUp: false };

  it("refuses guests on the web, but not in the app", () => {
    expect(requestGate({ ...base, account: { ...base.account, kind: "client" } }, DEFAULT_LOGIN_POLICY)).toMatchObject({ allow: false, code: "staff_only" });
    expect(requestGate({ ...base, surface: "app", account: { ...base.account, kind: "client" } }, DEFAULT_LOGIN_POLICY)).toEqual({ allow: true });
  });

  it("ends long web sessions for staff", () => {
    const old = new Date(now.getTime() - 13 * 3_600_000);
    expect(requestGate({ ...base, sessionCreatedAt: old }, DEFAULT_LOGIN_POLICY)).toMatchObject({ allow: false, code: "session_expired" });
  });

  it("holds the super admin (and sensitive roles when switched on) until 2-step is on", () => {
    const noTwoStep = { ...base, account: { ...base.account, twoFactorEnabled: false } };
    expect(requestGate({ ...noTwoStep, roleKeys: ["super-admin"] }, DEFAULT_LOGIN_POLICY)).toMatchObject({ code: "two_factor_required" });
    expect(requestGate({ ...noTwoStep, roleKeys: ["super-admin"], path: "/api/security/me/password" }, DEFAULT_LOGIN_POLICY)).toEqual({ allow: true });
    expect(requestGate(noTwoStep, DEFAULT_LOGIN_POLICY)).toEqual({ allow: true });
    expect(requestGate(noTwoStep, { ...DEFAULT_LOGIN_POLICY, twoFactorForSensitiveRoles: true })).toMatchObject({ code: "two_factor_required" });
  });

  it("tells web from app, and checks passwords", () => {
    expect(surfaceOf(new Headers({ origin: "http://web.test" }), ["http://web.test"])).toBe("web");
    expect(surfaceOf(new Headers({ authorization: "Bearer x" }), ["http://web.test"])).toBe("app");
    expect(surfaceOf(new Headers(), ["http://web.test"], "/callback/google")).toBe("web");
    expect(passwordProblem("Long enough 1", DEFAULT_LOGIN_POLICY)).toBeNull();
  });
});
