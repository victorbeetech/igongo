/**
 * The calendar's routes, mounted at `/api/calendar`:
 *   GET /           the guest calendar (availability only, no guest names)
 *   GET /settings   the settings (super admin)
 *   PUT /settings   save the settings (super admin)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, hotelDate, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import { readCalendar, type CalendarDeps } from "../application/use-cases/read-calendar";
import { saveCalendarSettings } from "../application/use-cases/save-calendar-settings";
import { calendarQuery, calendarSettingsBody } from "./calendar-request-schemas";

/** Permission keys for the calendar's settings, which the super admin gives to roles. */
const PERMISSIONS = {
  view: "booking-calendar.settings.view",
  edit: "booking-calendar.settings.edit",
} as const;

/**
 * Builds the calendar routes. [deps] gives the calendar's deps for one request
 * (the rooms' booking engine, the settings store and the clock).
 */
export function calendarRouter(deps: (c: Context<ActorEnv>) => CalendarDeps) {
  return new Hono<ActorEnv>()
    // Guest calendar. Anyone may read it; the response holds only availability.
    .get("/", zValidator("query", calendarQuery), async (c) => {
      const q = c.req.valid("query");
      // Default to hotel's today when no start day is sent.
      const from = q.from ?? hotelDate(new Date());
      return c.json(await readCalendar(deps(c), from, q.days));
    })
    // The settings, for the super admin's screen.
    .get("/settings", requireStaffPermission(PERMISSIONS.view), async (c) => c.json(await deps(c).settings.read()))
    // Save changes to the settings, recording who made them.
    .put("/settings", requireStaffPermission(PERMISSIONS.edit), zValidator("json", calendarSettingsBody), async (c) => {
      const d = deps(c);
      return c.json(await saveCalendarSettings(d, c.req.valid("json"), actorOf(c).userId));
    });
}
