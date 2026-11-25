/** One scan of a band at an event door, and what the door was told. */

/**
 * ok: let them in; not_assigned: band is in stock; wrong_event: band belongs
 * to another event; blocked: band is marked missing or retired; unknown: no
 * such band.
 */
export const SCAN_RESULTS = ["ok", "not_assigned", "wrong_event", "blocked", "unknown"] as const;
export type ScanResult = (typeof SCAN_RESULTS)[number];

export interface BandScan {
  id: string;
  bandNumber: number | null;
  /** The event the door was checking for, if any. */
  eventKey: string | null;
  result: ScanResult;
  /** Who scanned (a user ID). */
  actorId: string | null;
  at: Date;
}
