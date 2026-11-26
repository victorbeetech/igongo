/**
 * Pure booking arithmetic shared by every booking module: nights between
 * dates, the price of a booking, the status it starts in and the deposit.
 */

import type { BookingStatus } from "./booking";
import type { BookingRules } from "./booking-rules";
import type { Offering } from "./offering";

/** Nights from check-in [from] to check-out [to] (`YYYY-MM-DD`). */
export function nightsBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** The price of [units] of [offering]; nights multiply for stays. Enquiries are priced by staff later (0). */
export function priceOf(offering: Offering, units: number, nights: number): number {
  if (offering.kind === "enquiry") return 0;
  return offering.price * units * (offering.kind === "nights" ? nights : 1);
}

/** The deposit due on [total] under [rules]. */
export const depositOf = (rules: BookingRules, total: number) => Math.ceil((total * rules.depositPercent) / 100);

/** Where a new (or newly approved) booking starts. */
export function startingStatus(rules: BookingRules, kind: Offering["kind"], total: number, approved: boolean): BookingStatus {
  if (!approved && (kind === "enquiry" || rules.requireApproval)) return "requested";
  return depositOf(rules, total) > 0 ? "awaiting_payment" : "confirmed";
}

/** A random booking code, such as `RB-7KQ2MX` (no 0/O or 1/I, so it reads well aloud). */
export function bookingCode(prefix: string): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `${prefix}-${Array.from(bytes, (b) => letters[b % letters.length]).join("")}`;
}
