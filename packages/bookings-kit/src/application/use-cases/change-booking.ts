/**
 * Use cases that move a booking on:
 *   - approveBooking: staff accept a request, setting the price for enquiries;
 *   - cancelBooking: the guest up to the cancel deadline, or staff any time
 *     before check-in; stock goes back on the shelf;
 *   - checkIn: staff scan the QR or type the code at the door, desk or till;
 *   - recordBookingPayment: Payments says money came in.
 */

import { AppError, recordChange } from "@igongo/core";
import type { Booking } from "../../domain/booking";
import { depositOf, startingStatus } from "../../domain/booking-math";
import type { BookingsDeps } from "../bookings-deps";

/** The booking [id]. @throws AppError not_found */
export async function bookingOf(deps: BookingsDeps, id: string): Promise<Booking> {
  const booking = await deps.bookings.byId(id);
  if (!booking) throw new AppError("not_found", "Booking not found.");
  return booking;
}

/** Saves [b], recording [action] with [summary]. */
async function save(deps: BookingsDeps, b: Booking, action: string, summary: string): Promise<Booking> {
  const saved = { ...b, updatedAt: deps.change.now };
  await deps.bookings.update(saved);
  await recordChange(deps.change, { module: deps.module.key, action, recordType: "booking", recordId: b.id, summary: `${b.code}: ${summary}` });
  return saved;
}

export async function approveBooking(deps: BookingsDeps, id: string, total?: number): Promise<Booking> {
  const b = await bookingOf(deps, id);
  if (b.status !== "requested") throw new AppError("conflict", "Only a request can be approved.");
  if (b.kind === "enquiry" && total === undefined) throw new AppError("bad_request", "Give the quoted price.");
  const price = total ?? b.total;
  const status = startingStatus(await deps.rules.read(), b.kind, price, true);
  return save(deps, { ...b, total: price, status }, "booking.approved", `approved at ${price} UGX`);
}

export async function cancelBooking(deps: BookingsDeps, id: string, by: { userId: string; staff: boolean }, reason: string): Promise<Booking> {
  const b = await bookingOf(deps, id);
  if (!by.staff) {
    if (b.userId !== by.userId) throw new AppError("not_found", "Booking not found.");
    const hours = (await deps.rules.read()).cancelHoursBefore;
    // The deadline is that many hours before the day starts (hotel time, UTC+3).
    if (b.date && Date.parse(`${b.date}T00:00:00+03:00`) - deps.change.now.getTime() < hours * 3_600_000) throw new AppError("conflict", `Bookings can be cancelled up to ${hours} hours before. Please call us.`);
  }
  if (b.status === "checked_in" || b.status === "cancelled") throw new AppError("conflict", "This booking can no longer be cancelled.");
  if (b.kind === "stock") await deps.offerings.moveStock(b.offeringId, b.units);
  const note = b.paid > 0 ? `${reason} (refund ${b.paid} UGX)` : reason;
  return save(deps, { ...b, status: "cancelled", cancelReason: note }, "booking.cancelled", `cancelled: ${note}`);
}

export async function checkIn(deps: BookingsDeps, b: Booking): Promise<Booking> {
  if (b.status === "checked_in") throw new AppError("conflict", `${b.code} was already used at ${b.checkedInAt?.toISOString() ?? "an earlier time"}.`);
  if (b.status !== "confirmed") throw new AppError("conflict", `${b.code} is ${b.status.replace(/_/g, " ")}.`);
  return save(deps, { ...b, status: "checked_in", checkedInAt: deps.change.now }, "booking.checked_in", `${b.guestName} checked in`);
}

export async function recordBookingPayment(deps: BookingsDeps, id: string, amount: number): Promise<void> {
  const b = await bookingOf(deps, id);
  const paid = b.paid + amount;
  const enough = paid >= depositOf(await deps.rules.read(), b.total);
  await save(deps, { ...b, paid, status: b.status === "awaiting_payment" && enough ? "confirmed" : b.status }, "booking.paid", `paid ${amount} UGX`);
}
