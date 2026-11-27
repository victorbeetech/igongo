/**
 * End-to-end tests of the access model (build checklist phase B) on the
 * whole API: the staff web portal refuses guests on the server, a guest
 * becomes staff only through the super admin's staff match, staff roles
 * never go to guest accounts, the super admin console needs 2-step, the
 * last super admin stays, and people can download their own data.
 */

import { describe, expect, it } from "vitest";
import { testApi, testEnv, type Caller } from "./helpers";

/** A hotel with its owner (2-step on) and an HR manager on the web portal. */
async function hotel() {
  const t = await testApi();
  const owner = await t.owner();
  const hrAccount = (await owner("POST", "/api/users", { name: "Hana", email: "hana@example.com", password: "Hana pass 1234" })).body as { id: string };
  expect((await owner("POST", `/api/access/users/${hrAccount.id}/roles`, { roleId: "role_hr-manager" })).status).toBe(204);
  const hr = t.browser();
  expect((await hr("POST", "/api/auth/sign-in/email", { email: "hana@example.com", password: "Hana pass 1234" })).status).toBe(200);
  return { ...t, owner, hr };
}

/** Grace, a guest who signed up in the app. */
async function guestInApp(t: { phone: () => Caller }) {
  const grace = t.phone();
  const res = await grace("POST", "/api/auth/sign-up/email", { name: "Grace Nakato", email: "grace@example.com", password: "Grace pass 123" });
  expect(res.status).toBe(200);
  return { grace, userId: String((res.body["user"] as { id: string }).id) };
}

describe("the staff web portal and guests", () => {
  it("refuses a guest's sign-in on the web, and keeps guests away from staff data in the app", async () => {
    const t = await hotel();
    const { grace } = await guestInApp(t);
    // Web: the sign-in itself is refused.
    const web = t.browser();
    expect((await web("POST", "/api/auth/sign-in/email", { email: "grace@example.com", password: "Grace pass 123" })).status).toBe(403);
    expect((await web("GET", "/api/users/me")).status).toBe(401);
    // App: signed in, but every staff address answers 403.
    for (const path of ["/api/hr/staff", "/api/users", "/api/payroll/runs", "/api/audit/entries", "/api/admin/modules", "/api/security/overview", "/api/attendance/today"]) {
      expect([403, 404]).toContain((await grace("GET", path)).status);
    }
    expect(((await grace("GET", "/api/access/me")).body as { isStaff: boolean }).isStaff).toBe(false);
  });

  it("signs a guest's web session out on the server if one ever reaches the portal", async () => {
    const t = await hotel();
    await guestInApp(t);
    // Even a session made in the app, replayed as a browser cookie, is refused and ended.
    const signIn = await t.app.request("http://api.test/api/auth/sign-in/email", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "grace@example.com", password: "Grace pass 123" }) }, testEnv);
    const cookie = signIn.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    const res = await t.app.request("http://api.test/api/users/me", { headers: { origin: "http://web.test", cookie } }, testEnv);
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: "staff_only" });
    const again = await t.app.request("http://api.test/api/users/me", { headers: { cookie } }, testEnv);
    expect(again.status).toBe(401);
  });
});

describe("becoming staff", () => {
  it("only through the super admin's staff match, with a verified email", async () => {
    const t = await hotel();
    // HR enrols Grace's staff record (no account yet).
    const record = (await t.hr("POST", "/api/hr/staff", { name: "Grace Nakato", department: "kitchen", phone: "0772 123 456" })).body as { staffId: string; staffNumber: string };
    const { grace, userId } = await guestInApp(t);
    // HR cannot link an unverified guest account (linking gives the staff base role, which needs a verified email).
    expect((await t.hr("PATCH", `/api/hr/staff/${record.staffId}`, { userId })).status).toBe(400);
    // A staff role for an unverified app sign-up is refused (the email must be verified first).
    expect((await t.owner("POST", `/api/access/users/${userId}/roles`, { roleId: "role_waiter" })).status).toBe(400);
    // HR cannot do the match either: it is the super admin's.
    const match = { userId, staffNumber: record.staffNumber, phone: "+256772123456" };
    expect((await t.hr("POST", "/api/security/staff-match", match)).status).toBe(403);
    // Email not verified yet.
    expect((await t.owner("POST", "/api/security/staff-match", match)).status).toBe(400);
    await t.client.exec(`update users_login."user" set email_verified = true where email = 'grace@example.com'`);
    expect((await t.owner("POST", "/api/security/staff-match", { ...match, phone: "0700000000" })).status).toBe(400);
    expect((await t.owner("POST", "/api/security/staff-match", match)).body).toEqual({ staffId: record.staffId });
    // Now staff: the record is linked, staff roles can be given, and the web portal opens.
    expect(((await grace("GET", "/api/users/me")).body["account"] as { kind: string }).kind).toBe("staff");
    expect((await t.owner("POST", `/api/access/users/${userId}/roles`, { roleId: "role_waiter" })).status).toBe(204);
    const web = t.browser();
    expect((await web("POST", "/api/auth/sign-in/email", { email: "grace@example.com", password: "Grace pass 123" })).status).toBe(200);
    expect((await web("GET", "/api/hr/staff/me")).body).toMatchObject({ staffId: record.staffId });
    // All of it is in the Audit Trail.
    const actions = ((await t.owner("GET", "/api/audit/entries?module=users-login&limit=100")).body["items"] as { action: string }[]).map((e) => e.action);
    expect(actions).toEqual(expect.arrayContaining(["account.matched_to_staff", "login.succeeded"]));
  });
});

describe("the super admin", () => {
  it("warns about a missing second super admin, and never removes the last one", async () => {
    const t = await hotel();
    const overview = (await t.owner("GET", "/api/security/overview")).body as { superAdmins: { twoFactorEnabled: boolean }[]; warnings: string[] };
    expect(overview.superAdmins).toEqual([expect.objectContaining({ twoFactorEnabled: true })]);
    expect(overview.warnings[0]).toMatch(/second super admin/);
    const me = (await t.owner("GET", "/api/users/me")).body["account"] as { id: string };
    expect((await t.owner("DELETE", `/api/access/users/${me.id}/roles/role_super-admin`)).status).toBe(400);
  });

  it("keeps sign-in and security settings for the super admin, and they apply at once", async () => {
    const t = await hotel();
    expect((await t.hr("PATCH", "/api/login-methods/policy", { maxFailedAttempts: 3 })).status).toBe(403);
    expect((await t.owner("PATCH", "/api/login-methods/policy", { maxFailedAttempts: 3, lockoutMinutes: 5 })).status).toBe(200);
    await guestInApp(t);
    const someone = t.phone();
    for (let i = 0; i < 3; i++) await someone("POST", "/api/auth/sign-in/email", { email: "grace@example.com", password: `Wrong pass ${i}` });
    expect((await someone("POST", "/api/auth/sign-in/email", { email: "grace@example.com", password: "Grace pass 123" })).status).toBe(429);
    const log = ((await t.owner("GET", "/api/audit/entries?module=users-login&action=login.locked_out")).body["items"] as unknown[]).length;
    expect(log).toBe(1);
  });
});

describe("my data", () => {
  it("lets a guest download their data without secrets, then delete the account", async () => {
    const t = await testApi();
    const { grace } = await guestInApp(t);
    const data = await grace("GET", "/api/security/me/export");
    expect(data.headers.get("content-disposition")).toContain("my-igongo-data.json");
    expect(data.body).toMatchObject({ account: { email: "grace@example.com", kind: "client" } });
    expect(JSON.stringify(data.body)).not.toMatch(/password|token|secret/i);
    expect((await grace("POST", "/api/auth/delete-user", {})).status).toBe(200);
    expect((await grace("GET", "/api/users/me")).status).toBe(401);
  });
});
