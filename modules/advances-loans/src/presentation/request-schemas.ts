/** Zod schemas for Advances & Loans request bodies and queries. */

import { z } from "zod";
import { ADVANCE_KINDS, ADVANCE_STATUSES } from "../domain/advance";

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const ugx = z.number().int().positive().max(1_000_000_000);

/** `POST /advances/mine`. */
export const requestBody = z.object({ kind: z.enum(ADVANCE_KINDS).default("advance"), amount: ugx, instalments: z.number().int().min(1).max(60).default(1), reason: z.string().trim().min(3).max(1000) });

/** `GET /advances`. */
export const listQuery = z.object({ status: z.enum(ADVANCE_STATUSES).optional(), limit: z.coerce.number().int().min(1).max(500).default(100) });

/** `POST /advances/:id/decide`. */
export const decideBody = z.object({ approve: z.boolean(), note: z.string().trim().max(1000).nullable().default(null), instalments: z.number().int().min(1).max(60).optional(), startPeriod: month.optional() });

/** `POST /advances/:id/repay`. */
export const repayBody = z.object({ amount: ugx, period: month.optional() });

const kindRule = z.object({ enabled: z.boolean(), maxAmount: z.number().int().min(0), maxInstalments: z.number().int().min(1).max(60) });

/** `PUT /advances/settings`. */
export const rulesBody = z.object({ advance: kindRule, loan: kindRule, oneOpenAtATime: z.boolean() });
