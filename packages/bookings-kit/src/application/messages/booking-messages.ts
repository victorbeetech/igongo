/**
 * The wording of the messages a guest gets about their booking. One place, so
 * the Alerts inbox and the phone push always say the same thing.
 */

import type { Booking } from "../../domain/booking";

/** The message for a booking that is now confirmed (approved, or paid in full). */
export function confirmedMessage(b: Booking): { title: string; body: string } {
  return { title: "Booking confirmed", body: `${b.offeringName} for ${b.guestName} is confirmed. Booking ${b.code}.` };
}

/** The message for a booking the guest has just made, before it is confirmed. */
export function receivedMessage(b: Booking): { title: string; body: string } {
  return { title: "Booking received", body: `We have your booking for ${b.offeringName}. Booking ${b.code}.` };
}

/** The message for a booking that staff cancelled. */
export function cancelledMessage(b: Booking, reason: string): { title: string; body: string } {
  return { title: "Booking cancelled", body: `Booking ${b.code} for ${b.offeringName} was cancelled: ${reason}` };
}

/** The message for a request that staff approved but that still needs payment to be confirmed. */
export function approvedMessage(b: Booking): { title: string; body: string } {
  return { title: "Booking approved", body: `${b.offeringName} is approved. Pay to confirm booking ${b.code}.` };
}
