/** Zod schemas for Staff Meals request bodies and queries. */

import { z } from "zod";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const mealKey = z.string().regex(/^[a-z0-9-]{2,40}$/);

/** `POST /staff-meals/serve`: a card tap, a QR scan, or a person picked by hand. */
export const serveBody = z
  .object({ uid: z.string().trim().min(8).max(64).optional(), qr: z.string().trim().min(1).max(500).optional(), staffId: z.string().max(80).optional(), mealKey: mealKey.optional() })
  .refine((b) => [b.uid, b.qr, b.staffId].filter(Boolean).length === 1, "Send one of uid, qr or staffId.");

/** `GET /staff-meals/served`. */
export const dayQuery = z.object({ date: z.iso.date().optional() });

/** `PUT /staff-meals/rules`. */
export const rulesBody = z.object({
  meals: z
    .array(z.object({ key: mealKey, name: z.string().trim().min(2).max(60), startsAt: time, endsAt: time }).refine((m) => m.startsAt < m.endsAt, "A meal must end after it starts."))
    .max(10),
});
