/**
 * What the door sees for a scanned ticket: valid (let them in), used (already
 * checked in), forged (the signature does not match), cancelled, or unpaid
 * (not confirmed yet). Pure, so every rule is tested without a database.
 */

import type { Booking } from "./booking";

/** The outcomes of a scan. */
export type TicketVerdict = "valid" | "used" | "forged" | "cancelled" | "unpaid";

/** The verdict for [b] given whether its signature checked out. */
export function verdictOf(b: Booking, signatureOk: boolean): TicketVerdict {
  // Step 1: a bad signature is forged, whatever the booking says.
  if (!signatureOk) return "forged";
  // Step 2: the booking's own state.
  switch (b.status) {
    case "checked_in":
      return "used";
    case "cancelled":
      return "cancelled";
    case "confirmed":
      return "valid";
    default:
      return "unpaid";
  }
}
