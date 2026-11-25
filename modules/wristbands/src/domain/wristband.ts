/**
 * A reusable event wristband. The hotel registers 3,000 to 5,000 bands once,
 * then assigns a number range (such as 1 to 200) to each event and resets
 * the range afterwards.
 */

/** in_stock: ready; assigned: given to an event; missing: not returned; retired: worn out. */
export const BAND_STATUSES = ["in_stock", "assigned", "missing", "retired"] as const;
export type BandStatus = (typeof BAND_STATUSES)[number];

export interface Wristband {
  /** The number printed on the band, 1 and up. */
  bandNumber: number;
  /** NFC chip UID, upper-case hex, once encoded. */
  uid: string | null;
  /** The random secret in the printed QR code. Bands are reused, so it never changes. */
  qrToken: string;
  /** The band's kind, such as `event`, `pool` or `vip`. */
  bandType: string;
  status: BandStatus;
  /** The event it is assigned to (a key the event team chooses, such as `wedding-2026-12-05`). */
  eventKey: string | null;
  eventName: string | null;
  assignedAt: Date | null;
  createdAt: Date;
}

/** The most bands one range action may touch. */
export const MAX_RANGE = 5000;
