/**
 * The HTTP routes every booking module has, mounted by the gateway at
 * `/api/<path>` (such as `/api/rooms`). Built once here, used by Room
 * Bookings, Museum, Events, Pool and the Crafts & Bookshop.
 *
 *   GET   /offerings?all                what is on sale (public); `all=1` for staff
 *   GET   /offerings/:id                one offering
 *   GET   /offerings/:id/availability   units left for a date, dates or slot
 *   POST  /offerings                    add one (staff)
 *   PATCH /offerings/:id                change one (staff)
 *   GET|PUT /rules                      deposit, approval, cancel deadline, limit
 *   POST  /bookings                     book (guest), or book for a walk-in (staff)
 *   GET   /bookings/mine                my bookings, with QR codes
 *   GET   /bookings?date&status         the day's bookings (staff)
 *   GET   /bookings/:id                 one booking
 *   POST  /bookings/:id/cancel          cancel
 *   POST  /bookings/:id/approve         approve a request or quote an enquiry (staff)
 *   POST  /check-in                     scan a ticket QR or type its code (staff)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, canForOthers, recordChange, requirePermission, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { BookingsDeps } from "../application/bookings-deps";
import { approveBooking, cancelBooking, checkIn } from "../application/use-cases/change-booking";
import { unitsLeft } from "../application/use-cases/check-availability";
import { makeBooking } from "../application/use-cases/make-booking";
import { addOffering, editOffering } from "../application/use-cases/save-offering";
import type { Booking } from "../domain/booking";
import { bookingPermissions } from "./booking-permissions";
import { approveBody, availabilityQuery, bookBody, cancelBody, checkInBody, listQuery, offeringBody, offeringPatch, rulesBody } from "./request-schemas";

/** The text inside a booking's QR code. */
export const BOOKING_QR_PREFIX = "IGG-BK:";

/** A booking as the screens show it, with its QR text. */
const shown = (b: Booking) => ({ ...b, qr: `${BOOKING_QR_PREFIX}${b.code}` });

/** True when the caller (maybe nobody) is staff holding [permission]. */
function staff(c: Context<ActorEnv>, permission: string): boolean {
  const actor = c.get("actor");
  return !!actor && canForOthers(actor, permission);
}

export function bookingsRouter(moduleKey: string, deps: (c: Context<ActorEnv>) => BookingsDeps) {
  const P = bookingPermissions(moduleKey);
  return new Hono<ActorEnv>()
    .get("/offerings", async (c) => {
      const all = c.req.query("all") === "1" && staff(c, P.view);
      const items = (await deps(c).offerings.list()).filter((o) => all || (o.active && o.visibleToClients));
      return c.json({ items });
    })
    .get("/offerings/:id", async (c) => {
      const o = await deps(c).offerings.byId(c.req.param("id"));
      if (!o || (!staff(c, P.view) && (!o.active || !o.visibleToClients))) throw new AppError("not_found", "Not found.");
      return c.json(o);
    })
    .get("/offerings/:id/availability", zValidator("query", availabilityQuery), async (c) => {
      const d = deps(c);
      const o = await d.offerings.byId(c.req.param("id"));
      if (!o || !o.active) throw new AppError("not_found", "Not found.");
      const left = await unitsLeft(d, o, c.req.valid("query"));
      return c.json({ left: left === Number.MAX_SAFE_INTEGER ? null : left });
    })
    .post("/offerings", requireStaffPermission(P.offerings), zValidator("json", offeringBody), async (c) => c.json(await addOffering(deps(c), c.req.valid("json")), 201))
    .patch("/offerings/:id", requireStaffPermission(P.offerings), zValidator("json", offeringPatch), async (c) => c.json(await editOffering(deps(c), c.req.param("id"), c.req.valid("json"))))
    .get("/rules", async (c) => c.json(await deps(c).rules.read()))
    .put("/rules", requireStaffPermission(P.rules), zValidator("json", rulesBody), async (c) => {
      const d = deps(c);
      const rules = c.req.valid("json");
      await d.rules.write(rules, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: moduleKey, action: "bookings.rules_changed", recordType: "settings", recordId: "rules", summary: `Deposit ${rules.depositPercent}%, approval ${rules.requireApproval ? "on" : "off"}, cancel ${rules.cancelHoursBefore} h before` });
      return c.json(rules);
    })
    .post("/bookings", requirePermission(P.book), zValidator("json", bookBody), async (c) => {
      const actor = actorOf(c);
      const { guest, offeringId, units, notes, date, endDate, slot } = c.req.valid("json");
      const byStaff = !!guest && canForOthers(actor, P.book);
      if (guest && !byStaff) throw new AppError("permission_denied", "Only staff can book for other people.");
      const booking = await makeBooking(deps(c), {
        offeringId, units, ...(notes ? { notes } : {}), ...(date ? { date } : {}), ...(endDate ? { endDate } : {}), ...(slot ? { slot } : {}),
        guest: byStaff ? { userId: null, name: guest.name, phone: guest.phone ?? null } : { userId: actor.userId, name: actor.name, phone: null },
        byStaff,
      });
      return c.json(shown(booking), 201);
    })
    .get("/bookings/mine", requireSignIn, async (c) => c.json({ items: (await deps(c).bookings.list({ userId: actorOf(c).userId, limit: 200 })).map(shown) }))
    .get("/bookings", requireStaffPermission(P.view), zValidator("query", listQuery), async (c) => {
      const { date, status } = c.req.valid("query");
      return c.json({ items: (await deps(c).bookings.list({ ...(date ? { date } : {}), ...(status ? { status } : {}), limit: 500 })).map(shown) });
    })
    .get("/bookings/:id", requireSignIn, async (c) => {
      const b = await deps(c).bookings.byId(c.req.param("id"));
      if (!b || (b.userId !== actorOf(c).userId && !staff(c, P.view))) throw new AppError("not_found", "Booking not found.");
      return c.json(shown(b));
    })
    .post("/bookings/:id/cancel", requireSignIn, zValidator("json", cancelBody), async (c) => {
      const actor = actorOf(c);
      return c.json(shown(await cancelBooking(deps(c), c.req.param("id"), { userId: actor.userId, staff: canForOthers(actor, P.edit) }, c.req.valid("json").reason)));
    })
    .post("/bookings/:id/approve", requireStaffPermission(P.approve), zValidator("json", approveBody), async (c) => c.json(shown(await approveBooking(deps(c), c.req.param("id"), c.req.valid("json").total))))
    .post("/check-in", requireStaffPermission(P.edit), zValidator("json", checkInBody), async (c) => {
      const d = deps(c);
      const code = c.req.valid("json").code.replace(BOOKING_QR_PREFIX, "");
      const b = await d.bookings.byCode(code);
      if (!b) throw new AppError("not_found", "No booking has that code.");
      return c.json(shown(await checkIn(d, b)));
    });
}
