/** Zod schemas for Bonuses & Rewards request bodies and queries. */

import { z } from "zod";
import { BONUS_KINDS, BONUS_STATUSES } from "../domain/bonus";

/** `POST /bonuses`. */
export const awardBody = z.object({
  staffId: z.string().max(60),
  kind: z.enum(BONUS_KINDS),
  amount: z.number().int().min(0).max(1_000_000_000).default(0),
  passes: z.number().int().min(0).max(365).default(0),
  reason: z.string().trim().min(2).max(500),
});

/** `GET /bonuses`. */
export const listQuery = z.object({ status: z.enum(BONUS_STATUSES).optional(), kind: z.enum(BONUS_KINDS).optional(), limit: z.coerce.number().int().min(1).max(500).default(100) });

/** `POST /bonuses/:id/decide`. */
export const decideBody = z.object({ approve: z.boolean() });

/** `POST /bonuses/buffet/redeem`: a card tap, a QR scan or a chosen person. */
export const redeemBody = z.union([z.object({ uid: z.string().min(4).max(40) }), z.object({ qr: z.string().min(4).max(200) }), z.object({ staffId: z.string().max(60) })]);

/** `PUT /bonuses/settings`. */
export const rulesBody = z.object({
  cashEnabled: z.boolean(),
  buffetEnabled: z.boolean(),
  requireApproval: z.boolean(),
  buffetValidDays: z.number().int().min(1).max(366),
  onePassPerDay: z.boolean(),
  reasons: z.array(z.string().trim().min(2).max(120)).max(50),
});
