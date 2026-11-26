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
  return { app, client, errors, browser: () => browser(app) };
}

/** A pretend browser on the web origin: sends JSON and keeps the session cookie. */
function browser(app: ReturnType<typeof createApp>) {
  let cookie = "";
  return async (method: string, path: string, body?: unknown) => {
    const res = await app.request(
      `http://api.test${path}`,
      {
        method,
        headers: { origin: "http://web.test", "content-type": "application/json", ...(cookie ? { cookie } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      },
      testEnv,
    );
    const set = res.headers.getSetCookie().map((c) => c.split(";")[0]);
    if (set.length) cookie = set.join("; ");
    const text = await res.text();
    // JSON replies are parsed; files and CSV come back as { text }.
    const json = (res.headers.get("content-type") ?? "").includes("json");
    return { status: res.status, body: text ? (json ? (JSON.parse(text) as Record<string, unknown>) : { text }) : {}, headers: res.headers };
  };
}
