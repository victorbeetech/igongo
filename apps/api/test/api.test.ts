/**
 * End-to-end tests of the API Worker on PGlite: the shell (health, request
 * IDs, errors, CORS) and the first-day journey of the super admin: sign up,
 * claim the first set-up, build a role, give it, change settings, store a
 * key, and find all of it in the Audit Trail with the chain intact.
 */

import { describe, expect, it } from "vitest";
import { testApi, testEnv, totpCode } from "./helpers";

describe("the app shell", () => {
  it("answers health with the database status and a request ID", async () => {
    const { app } = await testApi();
    const res = await app.request("http://api.test/health", {}, testEnv);
    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBeTruthy();
    expect(await res.json()).toMatchObject({ status: "ok", database: "ok", environment: "test" });
  });

  it("answers unknown addresses and anonymous calls with JSON errors", async () => {
    const { browser } = await testApi();
    const call = browser();
    expect((await call("GET", "/nowhere")).body).toMatchObject({ error: "not_found" });
    expect((await call("GET", "/api/access/roles")).body).toMatchObject({ error: "sign_in_required" });
  });

  it("allows CORS with cookies only for the web portal", async () => {
    const { app } = await testApi();
    const ok = await app.request("http://api.test/api/login-methods", { headers: { origin: "http://web.test" } }, testEnv);
    expect(ok.headers.get("access-control-allow-origin")).toBe("http://web.test");
    const other = await app.request("http://api.test/api/login-methods", { headers: { origin: "http://evil.test" } }, testEnv);
    expect(other.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("the super admin's first day", () => {
  it("sets up the owner, then manages roles, settings and keys, all audited", async () => {
    const { browser, client, phone } = await testApi();
    const owner = browser();
    // A guest's sign-up on the web portal is refused; the app is the place.
    expect((await browser()("POST", "/api/auth/sign-up/email", { name: "Ann", email: "ann@example.com", password: "Ann pass 1234" })).body).toMatchObject({ code: "STAFF_ONLY" });
    expect((await phone()("POST", "/api/auth/sign-up/email", { name: "Ann", email: "ann@example.com", password: "Ann pass 1234" })).status).toBe(200);
    // Public: the login screen's methods, and the set-up is needed.
    expect(((await owner("GET", "/api/login-methods")).body["methods"] as unknown[]).length).toBeGreaterThan(0);
    expect((await owner("GET", "/api/setup/status")).body).toEqual({ needed: true });
    // Sign up; a verified email stands in for Google here.
    expect((await owner("POST", "/api/auth/sign-up/email", { name: "Owner", email: "owner@example.com", password: "Owner pass 123" })).status).toBe(200);
    await client.exec(`update users_login."user" set email_verified = true where email = 'owner@example.com'`);
    expect((await owner("POST", "/api/setup/claim")).status).toBe(200);
    expect((await owner("GET", "/api/setup/status")).body).toEqual({ needed: false });
    // The console waits for 2-step; turning it on gives recovery codes.
    expect((await owner("GET", "/api/access/roles")).body).toMatchObject({ error: "two_factor_required" });
    const enabled = (await owner("POST", "/api/auth/two-factor/enable", { password: "Owner pass 123" })).body as { totpURI: string; backupCodes: string[] };
    expect(enabled.backupCodes.length).toBeGreaterThanOrEqual(10);
    const secret = new URL(enabled.totpURI).searchParams.get("secret") ?? "";
    expect((await owner("POST", "/api/auth/two-factor/verify-totp", { code: await totpCode(secret) })).status).toBe(200);
    // My access now includes the console.
    const me = (await owner("GET", "/api/access/me")).body as { menu: string[] };
    expect(me.menu).toEqual(expect.arrayContaining(["roles-permissions", "audit-trail", "super-admin"]));
    // Build a role and give it to a new staff account.
    const role = (await owner("POST", "/api/access/roles", { key: "night-chef", name: "Night Chef", cloneFromRoleId: "role_executive-chef" })).body as { id: string };
    const staff = (await owner("POST", "/api/users", { name: "Sam", email: "sam@example.com", password: "Sam pass 1234" })).body as { id: string };
    expect((await owner("POST", `/api/users/${staff.id}/roles`.replace("/api/users", "/api/access/users"), { roleId: role.id })).status).toBe(204);
    // A bad request rolls back and is not recorded.
    expect((await owner("PATCH", `/api/access/roles/${role.id}`, { permissions: [{ key: "nope", scope: "all" }] })).status).toBe(400);
    // Settings, module switch and an encrypted key.
    expect((await owner("PATCH", "/api/admin/settings/branding", { announcement: "Welcome" })).status).toBe(200);
    expect((await owner("PATCH", "/api/admin/modules/pool", { enabled: false })).status).toBe(200);
    expect((await owner("PUT", "/api/admin/keys/apple.team_id", { value: "TEAM123456" })).status).toBe(204);
    const keys = (await owner("GET", "/api/admin/keys")).body as { items: { key: string; isSet: boolean; lastFour: string }[] };
    expect(keys.items.find((k) => k.key === "apple.team_id")).toMatchObject({ isSet: true, lastFour: "3456" });
    expect((await owner("GET", "/api/public/settings")).body).toMatchObject({ branding: { announcement: "Welcome" } });
    // Only the super admin can change the hotel's contact details: a signed-in guest is refused, and nothing changes.
    expect((await phone()("PATCH", "/api/admin/settings/hotel", { phone: "+256 999 999 999", contactUsOn: false })).status).toBeGreaterThanOrEqual(400);
    expect((await owner("GET", "/api/public/settings")).body).toMatchObject({ hotel: { phone: "", contactUsOn: true } });
    // Everything is in the Audit Trail, and the chain is intact.
    const audit = (await owner("GET", "/api/audit/entries?limit=100")).body as { items: { action: string }[] };
    const actions = audit.items.map((e) => e.action);
    expect(actions).toEqual(expect.arrayContaining(["role.created", "role.assigned", "account.created", "settings.changed", "module.disabled", "settings.secret_set", "login.succeeded"]));
    expect(actions).not.toContain("role.updated");
    expect((await owner("GET", "/api/audit/verify")).body).toMatchObject({ intact: true });
  });

  it("refuses the console to a signed-in client", async () => {
    const { phone } = await testApi();
    const guest = phone();
    await guest("POST", "/api/auth/sign-up/email", { name: "Ann", email: "ann@example.com", password: "Ann pass 1234" });
    expect((await guest("GET", "/api/admin/modules")).body).toMatchObject({ error: "permission_denied" });
    expect(((await guest("GET", "/api/users/me")).body["account"] as { kind: string }).kind).toBe("client");
    // Clients can delete their own account (the staging check does this too).
    expect((await guest("POST", "/api/auth/delete-user", {})).status).toBe(200);
    expect((await guest("GET", "/api/users/me")).status).toBe(401);
  });
});

describe("migrations", () => {
  it("records what was applied and does nothing the second time", async () => {
    const { runMigrations } = await import("../src/migrations/run-migrations");
    const { MIGRATIONS } = await import("../src/migrations/migrations.g");
    const { client } = await testApi();
    const { drizzle } = await import("drizzle-orm/pglite");
    const again = await runMigrations(drizzle(client) as never, MIGRATIONS);
    expect(again).toEqual({ applied: [], changedAfterApply: [] });
    const rows = await client.query("select count(*)::int as n from public.igongo_migrations");
    expect((rows.rows[0] as { n: number }).n).toBe(MIGRATIONS.length);
  });
});
