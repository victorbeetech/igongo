/** The super admin's rules for one booking module (each module's settings screen), kept as data. */

export interface BookingRules {
  /** Percent of the total to pay before a booking is confirmed (0 = pay later). */
  depositPercent: number;
  /** Every booking waits for staff approval. */
  requireApproval: boolean;
  /** Guests may cancel up to this many hours before the day. */
  cancelHoursBefore: number;
  /** The most units (rooms, tickets, items) in one booking. */
  maxUnits: number;
}

export const DEFAULT_BOOKING_RULES: BookingRules = { depositPercent: 0, requireApproval: false, cancelHoursBefore: 24, maxUnits: 20 };
