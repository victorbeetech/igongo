/** Zod schemas for Reports & Analytics queries and bodies. */

import { z } from "zod";

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** `GET /reports/dashboard`: hotel days, `to` included. Defaults to the super admin's range. */
export const rangeQuery = z.object({ from: day.optional(), to: day.optional() });

/** `PUT /reports/settings`. */
export const settingsBody = z.object({ hidden: z.array(z.string().max(80)).max(200), defaultDays: z.union([z.literal(1), z.literal(7), z.literal(30)]) });
