/**
 * Every API address the web portal and the app call exists. Reads each
 * `/api/...` string from apps/web/src and apps/igongo/lib, fills path
 * parameters with a placeholder, and asks the API with every method,
 * signed out. An address passes when one method reaches a route (any reply
 * but the API's own "No such address" 404), so a renamed or missing route
 * fails here instead of on a phone. A kit's base (`path: "/api/spa"`) is
 * checked through the records kit's `/config` or the bookings kit's
 * `/offerings`.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { testApi, testEnv } from "./helpers";

const ROOT = join(__dirname, "../../..");

/** Every file under [dir] ending in one of [exts]. */
function filesIn(dir: string, exts: string[]): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "node_modules" ? [] : filesIn(p, exts);
    return exts.some((e) => name.endsWith(e)) ? [p] : [];
  });
}

/** The `/api/...` addresses in the clients, parameters as `x`, query strings dropped. */
function clientPaths(): string[] {
  const files = [...filesIn(join(ROOT, "apps/web/src"), [".ts", ".tsx"]), ...filesIn(join(ROOT, "apps/igongo/lib"), [".dart"])];
  const found = new Set<string>();
  for (const f of files) {
    for (const m of readFileSync(f, "utf8").matchAll(/(path: )?["'`](\/api\/[^"'`?\s]*)/g)) {
      const path = (m[2] as string)
        // A template right after a word is a query string (`${rangeQuery(r)}`): dropped.
        .replace(/(?<=[\w.])\$\{.*$/, "")
        // A template or Dart `$name` after a slash is a path parameter.
        .replace(/\$\{[^}]*\}|\$[A-Za-z_]\w*/g, "x")
        .replace(/\/$/, "");
      // A bare module base (`/api/lost-found`) is joined on later: its full addresses are checked instead.
      // A parameter for the action itself (`/api/cards/${id}/${action}`) cannot be filled in here.
      // A kit place (`path: "/api/spa"`) is a base, checked through the kit's own addresses.
      if (m[1]) found.add(`${BASE}${path}`);
      else if (path.split("/").length > 3 && !/\/x\/x$/.test(path)) found.add(path);
    }
  }
  return [...found].sort();
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

/** Reads the super admin is rightly refused: other people's daily work or their own staff pages. */
const NOT_FOR_SUPER_ADMIN = [
  "/api/delivery/board", // dispatchers only
  "/api/delivery/riders", // dispatchers only
  "/api/delivery/rider/me", // riders only
  "/api/earnings/mine", // a staff member's own pay
  "/api/earnings/mine/export.csv",
  "/api/inspections/today", // the HODs who run checkups
];

/** Marks a kit base; it passes when the records kit or the bookings kit answers under it. */
const BASE = "base:";
const KIT_ADDRESSES = ["/config", "/offerings"];

describe("client addresses", () => {
  it("has a route for every address the web and the app call", async () => {
    const t = await testApi();
    const missing: string[] = [];
    for (const entry of clientPaths()) {
      const tries = entry.startsWith(BASE) ? KIT_ADDRESSES.map((a) => entry.slice(BASE.length) + a) : [entry];
      let reached = false;
      for (const [method, path] of METHODS.flatMap((m) => tries.map((p) => [m, p] as const))) {
        const res = await t.app.request(`http://api.test${path}`, { method, headers: { origin: "http://web.test", "content-type": "application/json" }, ...(method === "GET" || method === "DELETE" ? {} : { body: "{}" }) }, testEnv);
        const body = res.status === 404 ? await res.text() : "";
        if (!body.includes("No such address")) {
          reached = true;
          break;
        }
      }
      if (!reached) missing.push(entry);
    }
    expect(missing).toEqual([]);
  }, 120_000);

  it("lets the super admin open every screen's reads without a refusal or a crash", async () => {
    // A hotel with only its super admin.
    const t = await testApi();
    const owner = t.browser();
    await owner("POST", "/api/auth/sign-up/email", { name: "Owner", email: "owner@example.com", password: "Owner pass 123" });
    await t.client.exec(`update users_login."user" set email_verified = true where email = 'owner@example.com'`);
    expect((await owner("POST", "/api/setup/claim")).status).toBe(200);
    // Every fixed address (no parameter) read with GET: 403 or 5xx is a broken screen.
    const broken: string[] = [];
    const reads = clientPaths().flatMap((e) => (e.startsWith(BASE) ? KIT_ADDRESSES.map((a) => e.slice(BASE.length) + a) : [e])).filter((p) => !p.split("/").includes("x") && !NOT_FOR_SUPER_ADMIN.includes(p));
    for (const path of reads) {
      const res = await owner("GET", path);
      if (res.status === 403 || res.status >= 500) broken.push(`${res.status} ${path}`);
    }
    expect(t.errors).toEqual([]);
    expect(broken).toEqual([]);
  }, 120_000);
});
