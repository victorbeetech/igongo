/**
 * Use case: book (a room stay, ticket, pass, event request or shop item),
 * by a guest in the app or by staff for a walk-in. Steps:
 *   1. the offering must be on sale (and shown to clients, for guests),
 *   2. the dates or slot must fit, within the unit limit,
 *   3. enough must be left (stock is taken off the shelf at once),
 *   4. price it and pick its starting status (approval, deposit or confirmed),
 *   5. save it with a fresh code and record it.
 */

import { AppError, hotelDate, newId, recordChange } from "@igongo/core";
import type { Booking } from "../../domain/booking";
import { bookingCode, priceOf, startingStatus } from "../../domain/booking-math";
import type { BookingsDeps } from "../bookings-deps";
import { receivedMessage } from "../messages/booking-messages";
import { tellGuest } from "../tell-guest";
import { checkTime, unitsLeft, type WantedTime } from "./check-availability";

export interface BookInput extends WantedTime {
  offeringId: string;
  units: number;
  notes?: string;
  guest: { userId: string | null; name: string; phone: string | null };
  /** True when staff book for someone else (they may book hidden offerings). */
  byStaff: boolean;
}

export async function makeBooking(deps: BookingsDeps, input: BookInput): Promise<Booking> {
  const now = deps.change.now;
  // 1. On sale.
  const offering = await deps.offerings.byId(input.offeringId);
  if (!offering || !offering.active || (!input.byStaff && !offering.visibleToClients)) throw new AppError("not_found", "That is not available to book.");
  // 2. Time and limits.
  const rules = await deps.rules.read();
  if (input.units > rules.maxUnits) throw new AppError("bad_request", `At most ${rules.maxUnits} in one booking.`);
  const time = checkTime(offering, input, hotelDate(now));
  // 3. Enough left. Stock moves now, so two buyers cannot take the last one.
  if (offering.kind === "stock") {
    if (!(await deps.offerings.moveStock(offering.id, -input.units))) throw new AppError("conflict", `Only ${offering.capacity} of ${offering.name} left.`);
  } else if ((await unitsLeft(deps, offering, input)) < input.units) {
    throw new AppError("conflict", `${offering.name} is full for that time.`);
  }
  // 4. Price and status.
  const total = priceOf(offering, input.units, time.nights);
  const booking: Booking = {
    id: newId("bkg"), code: bookingCode(deps.module.prefix), offeringId: offering.id, offeringName: offering.name, kind: offering.kind,
    userId: input.guest.userId, guestName: input.guest.name, guestPhone: input.guest.phone, date: time.date, endDate: time.endDate, slot: time.slot, unit: null,
    units: input.units, total, paid: 0, status: startingStatus(rules, offering.kind, total, false), notes: input.notes ?? null,
    createdBy: input.byStaff ? deps.change.actorId : null, cancelReason: null, checkedInAt: null, createdAt: now, updatedAt: now,
  };
  // 5. Save and record.
  await deps.bookings.add(booking);
  await recordChange(deps.change, { module: deps.module.key, action: "booking.created", recordType: "booking", recordId: booking.id, summary: `${booking.code}: ${offering.name} x${booking.units} for ${booking.guestName}, ${total} UGX` });
  // The guest hears their booking was received (walk-ins have no account, so nothing is sent).
  await tellGuest(deps, booking, receivedMessage(booking));
  return booking;
}
