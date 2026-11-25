/** Test helper: a fresh in-memory Postgres (PGlite) with this module's migrations. */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

/** Runs every migration in order and returns the raw client and Drizzle. */
export async function freshDb() {
  const client = new PGlite();
  const dir = join(import.meta.dirname, "..", "migrations");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    for (const statement of readFileSync(join(dir, file), "utf8").split("--> statement-breakpoint")) {
      await client.exec(statement);
    }
  }
  return { client, db: drizzle(client) };
}

import type { AuditEntryInput } from "@igongo/contracts/audit-trail";
import type { AccessProfile, AccessReader, RoleAssigner } from "@igongo/contracts/roles-permissions";
import { createAuth, DrizzleAccountStore, DrizzleLoginSettingsStore, DrizzlePinStore, notConfiguredCardDirectory, notConfiguredCodeSender } from "../src";

/** Roles & Permissions stand-in: role keys per person, in memory. */
export function memoryAccess(): AccessReader & RoleAssigner & { held: Map<string, string[]> } {
  const held = new Map<string, string[]>();
  const profile = (userId: string): AccessProfile => {
    const keys = held.get(userId) ?? [];
    return { userId, roles: keys.map((key) => ({ id: key, key, name: key, level: "x", isStaff: key !== "guest" })), permissions: [], homeTiles: [], menu: [], isStaff: keys.some((k) => k !== "guest") };
  };
  return {
    held,
    profileFor: async (userId) => profile(userId),
    anyoneHolds: async (roleKey) => [...held.values()].some((keys) => keys.includes(roleKey)),
    holdersOf: async (roleKeys) => [...held].filter(([, keys]) => keys.some((k) => roleKeys.includes(k))).map(([id]) => id),
    assignByKey: async ({ userId, roleKey }) => void held.set(userId, [...(held.get(userId) ?? []), roleKey]),
  };
}

/** A full Better Auth set-up on PGlite with fakes for roles and the audit trail. */
export async function testAuth() {
  const { db, client } = await freshDb();
  const audit: AuditEntryInput[] = [];
  const deps = {
    db,
    settings: new DrizzleLoginSettingsStore(db),
    accounts: new DrizzleAccountStore(db),
    access: memoryAccess(),
    pins: new DrizzlePinStore(db),
    cards: notConfiguredCardDirectory,
    codes: notConfiguredCodeSender,
    audit: { record: async (e: AuditEntryInput) => void audit.push(e) },
  };
  const config = { baseURL: "http://api.test", secret: "test-secret-that-is-long-enough-123456", trustedOrigins: ["http://web.test"], google: null, apple: null };
  const auth = await createAuth(config, deps);
  /** Calls an auth route with a JSON body and optional cookie. */
  const call = (path: string, body?: unknown, cookie?: string) =>
    auth.handler(
      new Request(`http://api.test/api/auth${path}`, {
        method: body === undefined ? "GET" : "POST",
        headers: { "content-type": "application/json", origin: "http://web.test", ...(cookie ? { cookie } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      }),
    );
  return { db, client, auth, deps, audit, call };
}

/** The session cookie from a response, ready to send back. */
export function cookieOf(res: Response): string {
  return res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
}
