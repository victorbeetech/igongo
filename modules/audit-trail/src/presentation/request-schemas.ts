/** Zod schemas for the Audit Trail's query strings. */

import { z } from "zod";

/** `GET /audit/entries` filters. */
export const searchQuery = z.object({
  actorId: z.string().max(80).optional(),
  module: z.string().max(60).optional(),
  action: z.string().max(80).optional(),
  recordType: z.string().max(60).optional(),
  recordId: z.string().max(120).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  q: z.string().max(200).optional(),
  beforeSeq: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

/** `GET /audit/verify` range. */
export const verifyQuery = z.object({
  fromSeq: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50_000).default(10_000),
});
