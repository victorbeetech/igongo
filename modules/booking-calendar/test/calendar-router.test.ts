/**
 * Security check for the calendar routes, run through Hono with fake deps.
 * It proves that anyone may read availability (`GET /`) and that nobody
 * without the calendar's permission can read or change the settings. The
 * availability reply must hold only the fields a guest may see: no guest
 * names, phones, e-mails or booking notes.
 */

import { AppError, type ActorEnv } from "@igongo/core";
import type { BookingsDeps, Offering } from "@igongo/bookings-kit";
import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { CalendarDeps } from "../src/application/use-cases/read-calendar";
import type { CalendarSettingsStore } from "../src/application/ports/calendar-settings-store";
import { DEFAULT_CALENDAR_SETTINGS } from "../src/domain/calendar-settings";
import { calendarRouter } from "../src/presentation/calendar-router";

/** A room on sale and visible to guests, with one room booked. */
const room: Offering = {
  id: "rm_1",
  kind: "nights",
  name: "Garden Room",
  description: "Private",
  price: 100,
  capacity: 1,
  slots: [],
  onDate: null,
  photoUrl: null,
  details: { guestName: "Secret Guest" },
  active: true,
  visibleToClients: true,
  sortOrder: 0,
  updatedAt: new Date(),
};

/** Fake deps: one room, one unit taken on every day, and an in-memory settings store. */
function fakeDeps(): CalendarDeps {
  const now = new Date("2026-11-28T10:00:00Z");
  const booking = {
    change: { now },
    offerings: { list: async () => [room] },
    // One booking holds the room, with guest details that must never leave the API.
    bookings: {
      unitsTaken: async () => 1,
      listClashing: async () => [{ guestName: "Secret Guest", guestPhone: "+256700000000", userId: "usr_x", notes: "VIP" }],
    },
  } as unknown as BookingsDeps;
  const settings: CalendarSettingsStore = { read: async () => DEFAULT_CALENDAR_SETTINGS, write: async () => {} };
  return { booking, settings, change: { now } as CalendarDeps["change"] };
}

/** The API shell for the test: it sets the caller from a header and turns AppError into JSON. */
function appWith(deps: CalendarDeps) {
  const app = new Hono<ActorEnv>();
  app.use("*", async (c, next) => {
    const who = c.req.header("x-test-user");
    // A signed-in caller with no calendar permissions (a guest).
    if (who) c.set("actor", { userId: who, sessionId: `ses_${who}`, name: who, email: null, access: { permissions: [] } } as never);
    await next();
  });
  app.onError((err, c) => {
    if (err instanceof AppError) return c.json({ error: err.code, message: err.message }, err.status as 400);
    return c.json({ error: "internal_error" }, 500);
  });
  app.route("/api/calendar", calendarRouter(() => deps));
  return app;
}

describe("calendar routes: who may see what", () => {
  let app: ReturnType<typeof appWith>;

  beforeEach(() => {
    app = appWith(fakeDeps());
  });

  it("lets anyone, even a signed-out guest, read availability", async () => {
    const res = await app.request("/api/calendar?from=2026-11-29&days=1");
    expect(res.status).toBe(200);
  });

  it("returns only availability: no guest name, phone, e-mail or notes anywhere in the reply", async () => {
    const res = await app.request("/api/calendar?from=2026-11-29&days=3");
    const text = await res.text();
    expect(text).not.toMatch(/Secret Guest|guestName|guestPhone|userId|usr_x|notes|VIP|details|description|price|capacity/);
    // The shape: the calendar, its days and each room's units left, and nothing more.
    const body = JSON.parse(text) as { enabled: boolean; days: { date: string; status: string; rooms: Record<string, unknown>[] }[] };
    expect(Object.keys(body).sort()).toEqual(["days", "enabled"]);
    for (const day of body.days) {
      expect(Object.keys(day).sort()).toEqual(["date", "rooms", "status"]);
      for (const r of day.rooms) expect(Object.keys(r).sort()).toEqual(["left", "name", "offeringId"]);
    }
  });

  it("refuses a signed-out caller the settings", async () => {
    const res = await app.request("/api/calendar/settings");
    expect(res.status).toBe(401);
  });

  it("refuses a guest with no permission the settings, to read or to change", async () => {
    const read = await app.request("/api/calendar/settings", { headers: { "x-test-user": "usr_guest" } });
    expect(read.status).toBe(403);
    const write = await app.request("/api/calendar/settings", {
      method: "PUT",
      headers: { "content-type": "application/json", "x-test-user": "usr_guest" },
      body: JSON.stringify({ enabled: false }),
    });
    expect(write.status).toBe(403);
  });
});
