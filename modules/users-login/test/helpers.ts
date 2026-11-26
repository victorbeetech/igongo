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
import { createAuth, DrizzleAccountStore, DrizzleFailedLoginStore, DrizzleKnownDeviceStore, DrizzleLoginSettingsStore, DrizzlePinStore, notConfiguredCardDirectory } from "../src";

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
    removeAllFor: async (userId) => void held.delete(userId),
    holdersOf: async (roleKeys) => [...held].filter(([, keys]) => keys.some((k) => roleKeys.includes(k))).map(([id]) => id),
    assignByKey: async ({ userId, roleKey }) => void held.set(userId, [...(held.get(userId) ?? []), roleKey]),
  };
}

/**
 * A full Better Auth set-up on PGlite with fakes for roles and the audit
 * trail. [emailReady] false acts as if no email provider is set up yet.
 */
export async function testAuth({ emailReady = true }: { emailReady?: boolean } = {}) {
  const { db, client } = await freshDb();
  const audit: AuditEntryInput[] = [];
  const alerts: string[] = [];
  const sent: { channel: string; to: string; message: string }[] = [];
  const deps = {
    db,
    settings: new DrizzleLoginSettingsStore(db),
    accounts: new DrizzleAccountStore(db),
    access: memoryAccess(),
    pins: new DrizzlePinStore(db),
    cards: notConfiguredCardDirectory,
    // Codes and links are kept in memory, as if emailed.
    codes: { send: async (channel: string, to: string, message: string) => void sent.push({ channel, to, message }), ready: () => emailReady },
    audit: { record: async (e: AuditEntryInput) => void audit.push(e) },
    failedLogins: new DrizzleFailedLoginStore(db),
    devices: new DrizzleKnownDeviceStore(db),
    // Alerts are kept in memory so tests can read them.
    alerts: { toPerson: async (p: { email: string }, message: string) => void alerts.push(`${p.email}: ${message}`), toSuperAdmins: async (message: string) => void alerts.push(`admins: ${message}`) },
    bootstrapEmail: "owner@example.com",
  };
  const config = { baseURL: "http://api.test", secret: "test-secret-that-is-long-enough-123456", trustedOrigins: ["http://web.test"], google: null, apple: null };
  const auth = await createAuth(config, deps);
  /**
   * Calls an auth route with a JSON body and optional cookie. By default it
   * is the app (no web origin); `web: true` makes it the staff web portal.
   */
  const call = (path: string, body?: unknown, cookie?: string, opts: { web?: boolean; userAgent?: string } = {}) =>
    auth.handler(
      new Request(`http://api.test/api/auth${path}`, {
        method: body === undefined ? "GET" : "POST",
        headers: {
          "content-type": "application/json",
          ...(opts.web ? { origin: "http://web.test" } : {}),
          ...(opts.userAgent ? { "user-agent": opts.userAgent } : {}),
          ...(cookie ? { cookie } : {}),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      }),
    );
  return { db, client, auth, deps, audit, alerts, sent, call };
}

/** The session cookie from a response, ready to send back. */
export function cookieOf(res: Response): string {
  return res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
}
