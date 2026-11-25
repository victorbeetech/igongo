/**
 * One clock-in or clock-out. Events are never changed or deleted; a mistake
 * is fixed by adding a `manual` event with a reason (a correction), so the
 * history always shows what really happened.
 */

export const CLOCK_KINDS = ["in", "out"] as const;
export type ClockKind = (typeof CLOCK_KINDS)[number];

/** nfc: card tapped; qr: card QR scanned; app: the person's own phone; manual: a correction. */
export const CLOCK_METHODS = ["nfc", "qr", "app", "manual"] as const;
export type ClockMethod = (typeof CLOCK_METHODS)[number];

export interface ClockEvent {
  id: string;
  staffId: string;
  /** The person's department when they clocked, so old reports stay right after a transfer. */
  department: string | null;
  kind: ClockKind;
  method: ClockMethod;
  at: Date;
  /** The hotel's calendar day of `at` (YYYY-MM-DD), for daily lists. */
  workDate: string;
  /** Where: `Main gate`, `Reception`, or `App`. */
  station: string;
  /** Marked when a first clock-in of the day is after the start time and grace. */
  late: boolean;
  /** Who recorded it (a user ID): the person, the gatekeeper or HR. */
  recordedBy: string | null;
  /** Required for corrections. */
  note: string | null;
}
