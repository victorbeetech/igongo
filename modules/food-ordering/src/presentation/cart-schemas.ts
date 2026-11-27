/** Zod schemas for a guest's saved cart (`GET|PUT|DELETE /orders/cart`). */

import { z } from "zod";

/** A key such as an outlet's ID: lowercase letters, digits and dashes. */
const key = z.string().regex(/^[a-z0-9-]{2,40}$/);

/** `PUT /orders/cart`: the whole saved cart, replacing the old one. */
export const savedCartBody = z.object({
  outlet: key.nullable(),
  lines: z.array(z.object({
    itemId: z.string().trim().min(1).max(80),
    name: z.string().trim().min(1).max(200),
    quantity: z.number().int().min(1).max(100),
    unitPrice: z.number().int().min(0).max(100_000_000),
    options: z.array(z.string().max(90)).max(20).default([]),
    /** The day the guest wants this line (YYYY-MM-DD). */
    date: z.iso.date().nullable().default(null),
    notes: z.string().trim().min(1).max(300).nullable().default(null),
  })).max(50),
});
