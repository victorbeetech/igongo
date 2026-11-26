/** Zod schemas for Records Archive & Search queries. */

import { z } from "zod";

/** `GET /records/search` and `/records/export.csv`: every filter optional. */
export const searchQuery = z.object({
  q: z.string().trim().max(200).optional(),
  /** The person's account ID. */
  person: z.string().max(80).optional(),
  module: z.string().max(60).optional(),
  action: z.string().max(80).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  beforeSeq: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
