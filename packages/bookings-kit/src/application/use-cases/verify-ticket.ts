/**
 * Scans a ticket: reads its code, finds the booking, checks the server
 * signature, and gives the verdict. The booking is returned only when the
 * signature matches, so a forged ticket reveals no booking details.
 */

import { AppError } from "@igongo/core";
import type { BookingsDeps } from "../bookings-deps";
import type { Booking } from "../../domain/booking";
import { parseTicket, signatureMatches } from "../../domain/ticket-signature";
import { verdictOf, type TicketVerdict } from "../../domain/ticket-verdict";

/** The result of a scan. */
export interface TicketScan {
  verdict: TicketVerdict;
  /** The booking, only when the signature matched. */
  booking: Booking | null;
}

/** Scans [text] (the QR text or the typed ticket) against the server's key. */
export async function verifyTicket(deps: BookingsDeps, text: string): Promise<TicketScan> {
  // Step 1: without the signing key no ticket can be trusted, so say so plainly.
  if (!deps.ticketKey) throw new AppError("not_configured", "Ticket checks are not set up yet. Ask the super admin.");
  // Step 2: a text with no signature part is forged.
  const parsed = parseTicket(text);
  if (!parsed) return { verdict: "forged", booking: null };
  // Step 3: an unknown code is forged too, and reveals nothing.
  const b = await deps.bookings.byCode(parsed.code);
  if (!b) return { verdict: "forged", booking: null };
  // Step 4: the signature must match this booking's ID and code.
  const ok = await signatureMatches(deps.ticketKey, b.id, b.code, parsed.signature);
  return { verdict: verdictOf(b, ok), booking: ok ? b : null };
}
