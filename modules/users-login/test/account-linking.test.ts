/**
 * One person, one account, several sign-in methods: the linking rules on a
 * real Better Auth set-up (PGlite). Google and Apple themselves are not
 * reachable in tests, so the links are made through Better Auth's own
 * adapter, which runs the same checks (database hooks) as a real link.
 */

import { describe, expect, it } from "vitest";
import { FRESH_SIGN_IN_SECONDS } from "../src/infrastructure/auth/login-guard-hooks";
import { cookieOf, testAuth } from "./helpers";

const ann = { name: "Ann Guest", email: "ann@example.com", password: "Correct horse 1" };

/** A Google or Apple ID token carrying [email] (Better Auth has already checked the signature). */
const idToken = (email: string) => `x.${btoa(JSON.stringify({ email })).replace(/=+$/, "")}.y`;

/** Signs Ann up and returns her account ID, the sign-in cookie and the test set-up. */
async function annWithAccount() {
  const t = await testAuth();
  const up = await t.call("/sign-up/email", ann);
  const { user } = (await up.json()) as { user: { id: string } };
  return { t, userId: user.id, cookie: cookieOf(up), adapter: (await t.auth.$context).internalAdapter };
}

describe("linking sign-in methods to one account", () => {
  it("links Google with the same email, records it and emails the person", async () => {
    const { t, userId, adapter } = await annWithAccount();
    await adapter.linkAccount({ userId, providerId: "google", accountId: "g-1", idToken: idToken("ANN@example.com") });
    expect((await t.deps.accounts.get(userId))?.providers).toEqual(expect.arrayContaining(["credential", "google"]));
    expect(t.audit.map((e) => e.action)).toContain("login_method.linked");
    expect(t.alerts.some((a) => a.startsWith("ann@example.com:") && a.includes("google was linked"))).toBe(true);
  });

  it("refuses a Google or Apple account with a different email", async () => {
    const { t, userId, adapter } = await annWithAccount();
    await expect(adapter.linkAccount({ userId, providerId: "google", accountId: "g-2", idToken: idToken("mallory@example.com") })).rejects.toThrow(/different email/);
    await expect(adapter.linkAccount({ userId, providerId: "apple", accountId: "a-2" })).rejects.toThrow(/different email/);
    expect((await t.deps.accounts.get(userId))?.providers).toEqual(["credential"]);
  });

  it("accepts an Apple Hide My Email relay address linked from inside the account", async () => {
    const { t, userId, adapter } = await annWithAccount();
    await adapter.linkAccount({ userId, providerId: "apple", accountId: "a-1", idToken: idToken("x7k2q9@privaterelay.appleid.com") });
    expect((await t.deps.accounts.get(userId))?.providers).toEqual(expect.arrayContaining(["credential", "apple"]));
  });

  it("only links automatically when the provider verified the email and the account's own email is verified", async () => {
    const { t } = await annWithAccount();
    const linking = (await t.auth.$context).options.account?.accountLinking;
    // No provider is trusted blindly, and an unverified local email blocks auto-linking (no takeover by signing up first).
    expect(linking).toMatchObject({ enabled: true, trustedProviders: [], requireLocalEmailVerified: true });
  });

  it("needs a recent sign-in to add a method, and refuses without one", async () => {
    const { t, cookie } = await annWithAccount();
    expect(FRESH_SIGN_IN_SECONDS).toBeLessThanOrEqual(15 * 60);
    // Without a session: refused before anything starts.
    const anon = await t.call("/link-social", { provider: "google" });
    expect([401, 403]).toContain(anon.status);
    // With an old session: refused as not fresh.
    await t.client.exec(`update users_login."session" set created_at = now() - interval '1 hour'`);
    const stale = await t.call("/link-social", { provider: "google" }, cookie);
    expect(stale.status).toBe(403);
  });

  it("never removes the last sign-in method, and records and emails a removal", async () => {
    const { t, userId, cookie, adapter } = await annWithAccount();
    const [password] = await (await t.auth.$context).internalAdapter.findAccounts(userId);
    const last = await t.call("/unlink-account", { accountId: password?.id }, cookie);
    expect(last.status).toBe(400);
    expect(((await last.json()) as { code: string }).code).toMatch(/LAST_ACCOUNT|last/i);
    const google = await adapter.linkAccount({ userId, providerId: "google", accountId: "g-1", idToken: idToken("ann@example.com") });
    expect((await t.call("/unlink-account", { accountId: google.id }, cookie)).status).toBe(200);
    expect((await t.deps.accounts.get(userId))?.providers).toEqual(["credential"]);
    expect(t.audit.map((e) => e.action)).toContain("login_method.unlinked");
    expect(t.alerts.some((a) => a.includes("google was removed"))).toBe(true);
  });
});
