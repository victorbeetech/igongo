/** Zod schemas for Files & Media request bodies. */

import { z } from "zod";

/** `POST /files`: the file as base64, so the app and web send plain JSON. */
export const uploadBody = z.object({
  name: z.string().trim().min(1).max(200),
  type: z.string().regex(/^[a-z]+\/[a-z0-9.+-]+$/),
  /** The bytes, base64 (about 11 MB of text for an 8 MB photo). */
  data: z.string().min(4).max(30_000_000),
  /** The module the file is for, such as `faults-maintenance`. */
  purpose: z.string().regex(/^[a-z0-9-]{2,60}$/),
});

/** `PUT /files/settings`. */
export const rulesBody = z.object({
  maxMb: z.number().min(0.1).max(50),
  allowedTypes: z.array(z.string().regex(/^[a-z]+\/[a-z0-9.+-]+$/)).min(1).max(30),
});
