/**
 * Test helpers: the whole API on one in-memory Postgres (PGlite) with every
 * module's real migrations, and a small client that keeps cookies.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { Database } from "@igongo/core";
import { toBase64 } from "@igongo/core";
import { createApp } from "../src/app";
import type { Env } from "../src/shell/env";
import { MIGRATIONS } from "../src/migrations/migrations.g";
import { runMigrations } from "../src/migrations/run-migrations";

/** A pretend R2 bucket in memory, with the two calls Files & Media uses. */
function fakeBucket(): R2Bucket {
  const items = new Map<string, { body: Uint8Array; type: string }>();
  return {
    put: async (key: string, body: Uint8Array, opts?: { httpMetadata?: { contentType?: string } }) => void items.set(key, { body, type: opts?.httpMetadata?.contentType ?? "" }),
    get: async (key: string) => {
      const item = items.get(key);
      return item ? { body: item.body, httpMetadata: { contentType: item.type } } : null;
    },
  } as unknown as R2Bucket;
}

/** The Worker environment for tests. */
export const testEnv: Env = {
  ENVIRONMENT: "test",
  API_BASE_URL: "http://api.test",
  WEB_ORIGINS: "http://web.test",
  BETTER_AUTH_SECRET: "a-test-secret-that-is-at-least-32-characters",
  SETTINGS_ENCRYPTION_KEY: toBase64(crypto.getRandomValues(new Uint8Array(32))),
  BOOTSTRAP_ADMIN_EMAIL: "owner@example.com",
  PUSH_SENDER: "mock",
  FILES: fakeBucket(),
};

/** A fresh API with every migration applied. */
export async function testApi() {
  const client = new PGlite();
  const db = drizzle(client) as unknown as Database;
  // The same migrator the Worker runs in production.
  await runMigrations(db, MIGRATIONS);
  const errors: unknown[] = [];
  const app = createApp(() => ({ db, close: async () => {} }), (e) => void errors.push(e));
  return { app, client, db, errors, browser: () => browser(app), phone: () => phone(app), owner: () => signedInOwner(app, client) };
}

/** A caller as the tests use it: method, path and optional JSON body. */
export type Caller = (method: string, path: string, body?: unknown) => Promise<{ status: number; body: Record<string, unknown>; headers: Headers }>;

/** Reads a reply: JSON is parsed; files and CSV come back as { text }. */
async function reply(res: Response) {
  const text = await res.text();
  const json = (res.headers.get("content-type") ?? "").includes("json");
  return { status: res.status, body: text ? (json ? (JSON.parse(text) as Record<string, unknown>) : { text }) : {}, headers: res.headers };
}

/**
 * A pretend Igongo app on a phone: no web origin, and the session token
 * sent as `Authorization: Bearer`, the way the Flutter app does it.
 */
function phone(app: ReturnType<typeof createApp>): Caller {
  let token = "";
  return async (method, path, body) => {
    const res = await app.request(
      `http://api.test${path}`,
      {
        method,
        headers: { "content-type": "application/json", "user-agent": "Igongo app (Dart)", ...(token ? { authorization: `Bearer ${token}` } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      },
      testEnv,
    );
    token = res.headers.get("set-auth-token") ?? token;
    return reply(res);
  };
}

/** The current 6-digit code of an authenticator app for [secret] (base32), as RFC 6238 says. */
export async function totpCode(secret: string, at = Date.now()): Promise<string> {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bits = [...secret.replace(/=+$/, "").toUpperCase()].map((ch) => alphabet.indexOf(ch).toString(2).padStart(5, "0")).join("");
  const key = new Uint8Array((bits.match(/.{8}/g) ?? []).map((b) => parseInt(b, 2)));
  const counter = new DataView(new ArrayBuffer(8));
  counter.setBigUint64(0, BigInt(Math.floor(at / 30_000)));
  const hmacKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", hmacKey, counter.buffer));
  const offset = (mac[19] ?? 0) & 0xf;
  const value = (((mac[offset] ?? 0) & 0x7f) << 24) | ((mac[offset + 1] ?? 0) << 16) | ((mac[offset + 2] ?? 0) << 8) | (mac[offset + 3] ?? 0);
  return String(value % 1_000_000).padStart(6, "0");
}

/**
 * The owner on the web portal, as on day one: signs up (allowed once, for
 * the set-up), has a verified email (Google would confirm it), claims the
 * super admin role and turns on 2-step with an authenticator app, which the
 * console requires. Returns the signed-in caller and the 2-step secret.
 */
async function signedInOwner(app: ReturnType<typeof createApp>, client: PGlite): Promise<Caller & { secret: string }> {
  const owner = browser(app);
  await owner("POST", "/api/auth/sign-up/email", { name: "Owner", email: "owner@example.com", password: "Owner pass 123" });
  await client.exec(`update users_login."user" set email_verified = true where email = 'owner@example.com'`);
  if ((await owner("POST", "/api/setup/claim")).status !== 200) throw new Error("The owner could not claim the set-up.");
  const enabled = (await owner("POST", "/api/auth/two-factor/enable", { password: "Owner pass 123" })).body as { totpURI: string };
  const secret = new URL(enabled.totpURI).searchParams.get("secret") ?? "";
  if ((await owner("POST", "/api/auth/two-factor/verify-totp", { code: await totpCode(secret) })).status !== 200) throw new Error("2-step could not be turned on.");
  return Object.assign(owner, { secret });
}

/** A pretend browser on the staff web portal: sends JSON and keeps the session cookie. */
function browser(app: ReturnType<typeof createApp>): Caller {
  // Cookies by name, so a new cookie replaces only its own old value; an empty value deletes it.
  const jar = new Map<string, string>();
  return async (method: string, path: string, body?: unknown) => {
    const cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
    const res = await app.request(
      `http://api.test${path}`,
      {
        method,
        headers: { origin: "http://web.test", "content-type": "application/json", "user-agent": "Mozilla/5.0 (Windows NT 10.0) Chrome/130.0", ...(cookie ? { cookie } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      },
      testEnv,
    );
    for (const set of res.headers.getSetCookie()) {
      const [pair = ""] = set.split(";");
      const at = pair.indexOf("=");
      const [name, value] = [pair.slice(0, at), pair.slice(at + 1)];
      if (value && !/max-age=0/i.test(set)) jar.set(name, value);
      else jar.delete(name);
    }
    return reply(res);
  };
}
