/** Zod schemas for Wristbands request bodies and queries. */

import { z } from "zod";
import { BAND_STATUSES } from "../domain/wristband";

const number = z.coerce.number().int().min(1).max(999999);
const range = { from: number, to: number };
const eventKey = z.string().regex(/^[a-z0-9-]{2,80}$/, "Use lowercase words joined by dashes");

/** `POST /wristbands/register-range`. */
export const registerBody = z.object({ ...range, bandType: z.string().regex(/^[a-z0-9-]{2,40}$/).optional() });

/** `POST /wristbands/assign-range`. */
export const assignBody = z.object({ ...range, eventKey, eventName: z.string().trim().min(2).max(120) });

/** `POST /wristbands/reset-range`. */
export const resetBody = z.object(range);

/** `PATCH /wristbands/:number`. */
export const updateBody = z.object({ status: z.enum(["missing", "retired", "in_stock"]).optional(), uid: z.string().trim().min(8).max(64).optional() }).refine((b) => Boolean(b.status) !== Boolean(b.uid), "Send a status or a uid.");

/** `POST /wristbands/scan`. */
export const scanBody = z
  .object({ uid: z.string().trim().min(8).max(64).optional(), qr: z.string().trim().max(200).optional(), bandNumber: number.optional(), eventKey: eventKey.optional() })
  .refine((b) => [b.uid, b.qr, b.bandNumber].filter(Boolean).length === 1, "Send one of uid, qr or bandNumber.");

/** `GET /wristbands`. */
export const listQuery = z.object({
  status: z.enum(BAND_STATUSES).optional(),
  eventKey: eventKey.optional(),
  from: number.optional(),
  to: number.optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

/** `GET /wristbands/scans`. */
export const scansQuery = z.object({ eventKey: eventKey.optional(), limit: z.coerce.number().int().min(1).max(500).default(100) });
