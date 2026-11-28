/**
 * One booking (room stay, ticket, pass, event request or shop reservation).
 * Statuses:
 *   requested         waiting for staff approval (enquiries, or when the rules say so);
 *   awaiting_payment  waiting for the deposit;
 *   confirmed         good to go (paid enough, or pay later);
 *   checked_in        arrived, scanned in, or collected;
 *   cancelled.
 */

import type { OfferingKind } from "./offering";

export const BOOKING_STATUSES = ["requested", "awaiting_payment", "confirmed", "checked_in", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface Booking {
  id: string;
  /** The code on the ticket and its QR (`IGG-BK:<code>`), such as `RB-7KQ2MX`. */
  code: string;
  offeringId: string;
  /** The offering's name when booked. */
  offeringName: string;
  kind: OfferingKind;
  /** The guest's account, or null when staff booked for a walk-in. */
  userId: string | null;
  guestName: string;
  guestPhone: string | null;
  /** The day (or check-in day), `YYYY-MM-DD`; null for stock. */
  date: string | null;
  /** The check-out day, for nights. */
  endDate: string | null;
  slot: string | null;
  /** The room or cottage number, once staff assign one (null until then). */
  unit: string | null;
  /** Rooms, people or items. */
  units: number;
  total: number;
  paid: number;
  status: BookingStatus;
  notes: string | null;
  /** The staff member who booked it for the guest, if any. */
  createdBy: string | null;
  cancelReason: string | null;
  checkedInAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
