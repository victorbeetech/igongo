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
 *   PATCH /bookings/:id/unit            assign a room or cottage number (staff)
 *   POST  /check-in                     scan a signed ticket QR (staff); typed codes are refused
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, canForOthers, recordChange, requirePermission, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { BookingsDeps } from "../application/bookings-deps";
import { approveBooking, assignUnit, cancelBooking, checkIn } from "../application/use-cases/change-booking";
import { unitsLeft } from "../application/use-cases/check-availability";
import { makeBooking } from "../application/use-cases/make-booking";
import { addOffering, editOffering } from "../application/use-cases/save-offering";
import type { Booking } from "../domain/booking";
import { BOOKING_QR_PREFIX, issueTicket, parseTicket } from "../domain/ticket-signature";
import type { TicketVerdict } from "../domain/ticket-verdict";
import { verifyTicket } from "../application/use-cases/verify-ticket";
import { bookingPermissions } from "./booking-permissions";
import { approveBody, availabilityQuery, bookBody, cancelBody, checkInBody, listQuery, offeringBody, offeringPatch, rulesBody, ticketBody, unitBody } from "./request-schemas";

/** The text inside a booking's QR code. */
export { BOOKING_QR_PREFIX } from "../domain/ticket-signature";

/** A booking as the screens show it, with its QR text. */

/** True when the caller (maybe nobody) is staff holding [permission]. */
function staff(c: Context<ActorEnv>, permission: string): boolean {
  const actor = c.get("actor");
  return !!actor && canForOthers(actor, permission);
}

export function bookingsRouter(moduleKey: string, deps: (c: Context<ActorEnv>) => BookingsDeps) {
  const P = bookingPermissions(moduleKey);

  /** The booking as the app and the door see it. Its QR text is signed when ticket checks are on. */
  const present = async (c: Context<ActorEnv>, b: Booking) => {
    const key = deps(c).ticketKey ?? null;
    const ticket = key ? await issueTicket(key, b.id, b.code) : null;
    return { ...b, ticket, qr: `${BOOKING_QR_PREFIX}${ticket ?? b.code}` };
  };
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
      return c.json(await present(c, booking), 201);
    })
    .get("/bookings/mine", requireSignIn, async (c) => c.json({ items: await Promise.all((await deps(c).bookings.list({ userId: actorOf(c).userId, limit: 200 })).map((b) => present(c, b))) }))
    .get("/bookings", requireStaffPermission(P.view), zValidator("query", listQuery), async (c) => {
      const { date, status } = c.req.valid("query");
      const rows = await deps(c).bookings.list({ ...(date ? { date } : {}), ...(status ? { status } : {}), limit: 500 });
      return c.json({ items: await Promise.all(rows.map((b) => present(c, b))) });
    })
    .get("/bookings/:id", requireSignIn, async (c) => {
      const b = await deps(c).bookings.byId(c.req.param("id"));
      if (!b || (b.userId !== actorOf(c).userId && !staff(c, P.view))) throw new AppError("not_found", "Booking not found.");
      return c.json(await present(c, b));
    })
    .post("/bookings/:id/cancel", requireSignIn, zValidator("json", cancelBody), async (c) => {
      const actor = actorOf(c);
      return c.json(await present(c, await cancelBooking(deps(c), c.req.param("id"), { userId: actor.userId, staff: canForOthers(actor, P.edit) }, c.req.valid("json").reason)));
    })
    .post("/bookings/:id/approve", requireStaffPermission(P.approve), zValidator("json", approveBody), async (c) => c.json(await present(c, await approveBooking(deps(c), c.req.param("id"), c.req.valid("json").total))))
    // Staff assign the room or cottage number of a booking (null clears it).
    .patch("/bookings/:id/unit", requireStaffPermission(P.edit), zValidator("json", unitBody), async (c) => c.json(await present(c, await assignUnit(deps(c), c.req.param("id"), c.req.valid("json").unit))))
    .post("/check-in", requireStaffPermission(P.edit), zValidator("json", checkInBody), async (c) => {
      const d = deps(c);
      const text = c.req.valid("json").code;
      // Step 1: a signed ticket (scanned QR) must pass its signature check first.
      if (parseTicket(text)) {
        const scan = await verifyTicket(d, text);
        if (scan.verdict !== "valid" || !scan.booking) throw new AppError("conflict", ticketMessage(scan.verdict));
        return c.json(await present(c, await checkIn(d, scan.booking)));
      }
      // Step 2: anything else is refused. Only a signed ticket can check a guest in, so a code read off a ticket cannot be used.
      throw new AppError("conflict", "Scan the signed ticket QR. A typed booking code cannot check a guest in.");
    })
    // Scan a ticket: the verdict (valid, used, forged, cancelled or unpaid) and the booking details when the signature matches.
    .post("/tickets/verify", requireStaffPermission(P.edit), zValidator("json", ticketBody), async (c) => {
      const scan = await verifyTicket(deps(c), c.req.valid("json").ticket);
      return c.json({ verdict: scan.verdict, booking: scan.booking ? await present(c, scan.booking) : null });
    })
    // Check a valid ticket in: marks it used. The audit trail records the staff member and the time.
    .post("/tickets/check-in", requireStaffPermission(P.edit), zValidator("json", ticketBody), async (c) => {
      const d = deps(c);
      const scan = await verifyTicket(d, c.req.valid("json").ticket);
      if (scan.verdict !== "valid" || !scan.booking) throw new AppError("conflict", ticketMessage(scan.verdict));
      const b = await checkIn(d, scan.booking);
      return c.json({ verdict: "checked_in", booking: await present(c, b) });
    });
}

/** The words the door shows for a ticket that cannot be let in. */
function ticketMessage(verdict: TicketVerdict): string {
  switch (verdict) {
    case "used":
      return "This ticket was already used.";
    case "forged":
      return "This ticket is forged: its signature does not match.";
    case "cancelled":
      return "This booking was cancelled.";
    default:
      return "This booking is not paid or confirmed yet.";
  }
}
