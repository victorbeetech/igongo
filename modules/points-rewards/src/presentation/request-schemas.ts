/**
 * The request shapes the points routes accept. Each number has a sensible
 * range, so a typo (a value of 10 million) is refused before it is saved.
 */

import { z } from "zod";

/** The whole rules set. The super admin's screen always sends every field. */
export const rulesBody = z
  .object({
    enabled: z.boolean(),
    pointsPer1000Ugx: z.number().int().min(0).max(1000),
    signupBonus: z.number().int().min(0).max(100000),
    minimumToRedeem: z.number().int().min(1).max(1000000),
    ugxPerPoint: z.number().int().min(0).max(1000000),
    expiryDays: z.number().int().min(0).max(3650),
  })
  .strict();

/** A manual adjustment by the super admin. `points` is signed; zero is refused. */
export const adjustBody = z
  .object({
    guestId: z.string().min(1).max(100),
    points: z.number().int().min(-1000000).max(1000000).refine((n) => n !== 0, "Enter a number of points other than zero."),
    note: z.string().trim().min(3).max(200),
    key: z.string().min(8).max(100),
  })
  .strict();
