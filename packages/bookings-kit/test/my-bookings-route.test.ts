/**
 * My bookings (GET /bookings/mine and GET /bookings/:id): a guest sees only
 * their own bookings, past and upcoming, and cannot open someone else's.
 * Runs the real router with an in-memory booking list.
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
import type { Booking } from "../src/domain/booking";
import { bookingsRouter } from "../src/presentation/bookings-router";

/** One booking for [userId] on [date], with the fields the router reads. */
function bookingFor(id: string, userId: string | null, date: string, status: Booking["status"] = "confirmed"): Booking {
  const now = new Date("2026-11-27T06:00:00Z");
  return {
    id,
    code: `RB-${id.toUpperCase()}`,
    offeringId: "off_1",
    unit: null,
    offeringName: "Deluxe room",
    kind: "nights",
    userId,
    guestName: "Guest",
    guestPhone: null,
    date,
    endDate: null,
    slot: null,
    units: 1,
    total: 100000,
    paid: 100000,
    status,
    notes: null,
    createdBy: null,
    cancelReason: null,
    checkedInAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

/** An in-memory booking store that filters by guest the way the database does. */
function fakeBookings(rows: Booking[]): BookingRepository {
  return {
    byId: async (id) => rows.find((b) => b.id === id) ?? null,
    byCode: async (code) => rows.find((b) => b.code === code) ?? null,
    list: async (filter) => rows.filter((b) => (filter.userId ? b.userId === filter.userId : true)).slice(0, filter.limit),
    unitsTaken: async () => 0,
    add: async () => undefined,
    update: async () => undefined,
  };
}

/** A signed-in guest with no staff permissions: the routes check the permission list before the owner check. */
function actorFor(userId: string): Actor {
  return { userId, sessionId: `ses_${userId}`, name: userId, email: `${userId}@example.com`, access: { permissions: [] } as unknown as Actor["access"] };
}

describe("my bookings routes", () => {
  const rows = [
    bookingFor("b1", "usr_a", "2026-10-02"), // a past stay of Ada
    bookingFor("b2", "usr_a", "2026-12-20"), // an upcoming stay of Ada
    bookingFor("b3", "usr_b", "2026-10-05"), // a past stay of Bob
  ];
  const audit: AuditRecorder = { record: async () => undefined };
  const deps: BookingsDeps = {
    module: {} as BookingModule, // not used by these routes
    offerings: {} as OfferingRepository, // not used by these routes
    rules: {} as BookingRulesStore, // not used by these routes
    bookings: fakeBookings(rows),
    change: { actorId: null, audit, now: new Date("2026-11-27T06:00:00Z") },
    ticketKey: null,
  };

  // The test stands in for the API shell: it sets the caller from a header and turns AppError into JSON.
  const app = new Hono<ActorEnv>();
  app.use("*", async (c, next) => {
    const who = c.req.header("x-test-user");
    if (who) c.set("actor", actorFor(who));
    c.set("requestId", "test");
    await next();
  });
  app.onError((err, c) => {
    if (err instanceof AppError) return c.json({ error: err.code, message: err.message }, err.status as 400);
    return c.json({ error: "internal_error" }, 500);
  });
  app.route("/api/rooms", bookingsRouter("room-bookings", () => deps));

  it("refuses a caller who is not signed in", async () => {
    const res = await app.request("/api/rooms/bookings/mine");
    expect(res.status).toBe(401);
  });

  it("lists only my own bookings, past and upcoming", async () => {
    const res = await app.request("/api/rooms/bookings/mine", { headers: { "x-test-user": "usr_a" } });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { items: Array<{ id: string }> };
    expect(body.items.map((b) => b.id).sort()).toEqual(["b1", "b2"]);
  });

  it("does not open another guest's booking", async () => {
    const res = await app.request("/api/rooms/bookings/b3", { headers: { "x-test-user": "usr_a" } });
    expect(res.status).toBe(404);
  });

  it("opens my own past booking", async () => {
    const res = await app.request("/api/rooms/bookings/b1", { headers: { "x-test-user": "usr_a" } });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ id: "b1", userId: "usr_a" });
  });
});
