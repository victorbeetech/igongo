/** Zod schemas for Staff Cards request bodies and queries. */

import { CARD_STATUSES } from "@igongo/contracts/staff-cards";
import { z } from "zod";

const uid = z.string().trim().min(8).max(64);
const designKey = z.string().regex(/^[a-z0-9-]{2,60}$/);

/** `POST /cards`: a blank card into stock. */
export const registerBody = z.object({
  cardNumber: z.string().trim().min(1).max(30).optional(),
  uid: uid.optional(),
  cardType: designKey.optional(),
  templateKey: designKey.optional(),
});

/** `POST /cards/:id/issue`. */
export const issueBody = z.object({ staffId: z.string().min(1).max(80), templateKey: designKey.optional() });

/** `POST /cards/:id/encode`. */
export const encodeBody = z.object({ uid });

/** `POST /cards/resolve`: what a reader or camera saw. */
export const scanBody = z.object({ uid: uid.optional(), qr: z.string().trim().min(1).max(500).optional() }).refine((s) => Boolean(s.uid) !== Boolean(s.qr), "Send a uid or a qr, not both.");

/** `GET /cards`. */
export const listQuery = z.object({
  status: z.enum(CARD_STATUSES).optional(),
  staffId: z.string().max(80).optional(),
  q: z.string().trim().max(30).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
