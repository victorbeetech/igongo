/** Zod schemas for Attendance request bodies and queries. */

import { z } from "zod";
import { CLOCK_KINDS } from "../domain/clock-event";

const date = z.iso.date();

/** `POST /attendance/station-clock`: what the gate reader or camera saw. */
export const stationBody = z
  .object({ uid: z.string().trim().min(8).max(64).optional(), qr: z.string().trim().min(1).max(500).optional(), station: z.string().trim().min(2).max(60) })
  .refine((b) => Boolean(b.uid) !== Boolean(b.qr), "Send a uid or a qr, not both.");

/** `POST /attendance/corrections`. */
export const correctionBody = z.object({ staffId: z.string().min(1).max(80), kind: z.enum(CLOCK_KINDS), at: z.iso.datetime({ offset: true }), reason: z.string().trim().min(5).max(500) });

/** `GET /attendance/mine` and `/attendance/events`: a date range, at most 93 days. */
export const rangeQuery = z
  .object({ from: date, to: date, staffId: z.string().max(80).optional() })
  .refine((q) => q.from <= q.to, "from must be before to")
  .refine((q) => (Date.parse(q.to) - Date.parse(q.from)) / 86400000 <= 93, "At most 93 days at a time.");

/** `GET /attendance/board`. */
export const boardQuery = z.object({ date: date.optional() });

/** `PUT /attendance/rules`. */
export const rulesBody = z.object({
  dayStartsAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  graceMinutes: z.number().int().min(0).max(240),
  allowAppClock: z.boolean(),
  doubleTapSeconds: z.number().int().min(0).max(3600),
});
