/**
 * Who may change a booking module's settings and what is on sale (the Events, Museum,
 * Pool and other settings pages). Each change is refused unless the caller holds the
 * module's settings or offerings permission with a wide enough scope, and guests never
 * see hidden or switched-off offerings. Runs the real router with in-memory stores.
 */

import type { AuditRecorder } from "@igongo/contracts/audit-trail";
import type { Actor } from "@igongo/contracts/users-login";
import { AppError, type ActorEnv } from "@igongo/core";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import type { BookingModule } from "../src/application/booking-module";
import type { BookingsDeps } from "../src/application/bookings-deps";
import type { BookingRepository } from "../src/application/ports/booking-repository";
import type { OfferingRepository } from "../src/application/ports/offering-repository";
import type { BookingRulesStore } from "../src/application/ports/rules-store";
import type { Offering } from "../src/domain/offering";
import type { BookingRules } from "../src/domain/booking-rules";
import { DEFAULT_BOOKING_RULES } from "../src/domain/booking-rules";
import { bookingsRouter } from "../src/presentation/bookings-router";
import { offeringPatch } from "../src/presentation/request-schemas";

const MODULE = "events-conferences";

/** One offering, on sale and shown to clients unless [patch] says otherwise. */
function offeringFor(id: string, patch: Partial<Offering> = {}): Offering {
  return {
    id,
    kind: "slot",
    name: `Offering ${id}`,
    description: "Described",
    price: 50000,
    capacity: 100,
    slots: ["09:00", "11:00"],
    onDate: "2026-12-20",
    photoUrl: null,
    details: { venue: "Hall" },
    active: true,
    visibleToClients: true,
    sortOrder: 3,
    updatedAt: new Date("2026-11-27T06:00:00Z"),
    ...patch,
  };
}

/** A signed-in person holding exactly [permissions] (key and scope). */
function actorWith(userId: string, permissions: Array<{ key: string; scope: string }>): Actor {
  return { userId, sessionId: `ses_${userId}`, name: userId, email: `${userId}@example.com`, access: { permissions } as unknown as Actor["access"] };
}

describe("booking settings permissions", () => {
  // The fake stores keep what the routes write, so each test can read it back.
  const offerings = new Map<string, Offering>([
    ["live", offeringFor("live")],
    ["hidden", offeringFor("hidden", { visibleToClients: false })],
    ["off", offeringFor("off", { active: false })],
  ]);
  let rules: BookingRules = { ...DEFAULT_BOOKING_RULES };
  const audited: string[] = [];

  const offeringStore: OfferingRepository = {
    byId: async (id) => offerings.get(id) ?? null,
    list: async () => [...offerings.values()],
    save: async (o) => void offerings.set(o.id, o),
    moveStock: async () => true,
  };
  const rulesStore: BookingRulesStore = {
    read: async () => rules,
    write: async (r) => void (rules = r),
  };
  const bookings: BookingRepository = {
    byId: async () => null,
    byCode: async () => null,
    list: async () => [],
    unitsTaken: async () => 0,
    add: async () => undefined,
    update: async () => undefined,
  };
  // Records the action name of each audit entry, so a test can check a change was recorded.
  const audit: AuditRecorder = { record: async (entry) => void audited.push(entry.action) };
  const deps: BookingsDeps = {
    module: { key: MODULE, prefix: "EV", kinds: ["slot", "enquiry"], noun: "Event booking" } as BookingModule,
    offerings: offeringStore,
    rules: rulesStore,
    bookings,
    change: { actorId: null, audit, now: new Date("2026-11-27T06:00:00Z") },
    ticketKey: null,
  };

  // Stands in for the API shell: the caller comes from a header; AppError becomes JSON with its code.
  const app = new Hono<ActorEnv>();
  // The permissions the test caller holds, set from the header's name.
  const grants: Record<string, Array<{ key: string; scope: string }>> = {
    guest: [],
    viewer: [{ key: `${MODULE}.bookings.view`, scope: "all" }],
    settings: [{ key: `${MODULE}.settings.edit`, scope: "all" }],
    offers: [{ key: `${MODULE}.offerings.edit`, scope: "all" }],
    ownOnly: [{ key: `${MODULE}.settings.edit`, scope: "own" }],
  };
  app.use("*", async (c, next) => {
    const who = c.req.header("x-test-user");
    if (who) c.set("actor", actorWith(who, grants[who] ?? []));
    c.set("requestId", "test");
    await next();
  });
  app.onError((err, c) => {
    if (err instanceof AppError) return c.json({ error: err.code, message: err.message }, err.status as 400);
    return c.json({ error: "internal_error" }, 500);
  });
  app.route("/api/events", bookingsRouter(MODULE, () => deps));

  const put = (who: string | null, body: unknown) =>
    app.request("/api/events/rules", { method: "PUT", headers: { "content-type": "application/json", ...(who ? { "x-test-user": who } : {}) }, body: JSON.stringify(body) });
  const patch = (who: string | null, id: string, body: unknown) =>
    app.request(`/api/events/offerings/${id}`, { method: "PATCH", headers: { "content-type": "application/json", ...(who ? { "x-test-user": who } : {}) }, body: JSON.stringify(body) });
  const newRules = { depositPercent: 30, requireApproval: true, cancelHoursBefore: 48, maxUnits: 8 };

  it("refuses a rules change from nobody signed in", async () => {
    const res = await put(null, newRules);
    expect(res.status).toBe(401);
    expect(rules).toEqual(DEFAULT_BOOKING_RULES);
  });

  it("refuses a rules change from a signed-in person without the settings permission", async () => {
    const res = await put("guest", newRules);
    expect(await res.json()).toMatchObject({ error: "permission_denied" });
    expect(rules).toEqual(DEFAULT_BOOKING_RULES);
  });

  it("refuses a rules change from someone who holds the permission only for their own records", async () => {
    const res = await put("ownOnly", newRules);
    expect(await res.json()).toMatchObject({ error: "permission_denied" });
    expect(rules).toEqual(DEFAULT_BOOKING_RULES);
  });

  it("saves a rules change from someone with the settings permission, and records it", async () => {
    const res = await put("settings", newRules);
    expect(res.status).toBe(200);
    expect(rules).toEqual(newRules);
    expect(audited).toContain("bookings.rules_changed");
  });

  it("refuses an offering change without the offerings permission", async () => {
    const res = await patch("settings", "live", { price: 1 });
    expect(await res.json()).toMatchObject({ error: "permission_denied" });
    expect(offerings.get("live")?.price).toBe(50000);
  });

  it("changes only the fields sent when an offering is switched off", async () => {
    const res = await patch("offers", "live", { active: false });
    expect(res.status).toBe(200);
    // Times, sort order, description and details must survive a switch.
    expect(offerings.get("live")).toMatchObject({ active: false, slots: ["09:00", "11:00"], sortOrder: 3, description: "Described", details: { venue: "Hall" }, visibleToClients: true });
  });

  it("hides hidden and switched-off offerings from guests, and shows them to staff who ask", async () => {
    // By now "live" is switched off too (the test above), so a guest sees none of the three.
    const guestList = (await (await app.request("/api/events/offerings?all=1", { headers: { "x-test-user": "guest" } })).json()) as { items: Array<{ id: string }> };
    expect(guestList.items).toEqual([]);
    const staffList = (await (await app.request("/api/events/offerings?all=1", { headers: { "x-test-user": "viewer" } })).json()) as { items: Array<{ id: string }> };
    expect(staffList.items.map((o) => o.id).sort()).toEqual(["hidden", "live", "off"]);
  });
});

describe("offering change body", () => {
  it("leaves out every field that was not sent, instead of filling its default", () => {
    expect(offeringPatch.parse({ active: false })).toEqual({ active: false });
  });

  it("still checks the fields that are sent", () => {
    expect(offeringPatch.safeParse({ price: -5 }).success).toBe(false);
  });
});
