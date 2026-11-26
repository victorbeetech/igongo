/** Zod schemas for Menus & Catalogue request bodies and queries. */

import { z } from "zod";

const key = z.string().regex(/^[a-z0-9-]{2,40}$/);
const money = z.number().int().min(0).max(100_000_000);

const optionGroup = z.object({
  key,
  name: z.string().trim().min(1).max(60),
  required: z.boolean(),
  multiple: z.boolean(),
  choices: z.array(z.object({ key, name: z.string().trim().min(1).max(60), priceDelta: z.number().int().min(-10_000_000).max(10_000_000) })).min(1).max(30),
});

/** `POST /menu/items` (all fields) and `PATCH /menu/items/:id` (any of them). */
export const itemBody = z.object({
  outlet: key,
  section: z.string().trim().min(1).max(60),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000).nullable().default(null),
  price: money,
  prepMinutes: z.number().int().min(0).max(24 * 60),
  options: z.array(optionGroup).max(10).default([]),
  tags: z.array(key).max(10).default([]),
  allergens: z.array(key).max(15).default([]),
  photoUrl: z.url().nullable().default(null),
  active: z.boolean().default(true),
  visibleToClients: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10_000).default(0),
});
export const itemPatch = itemBody.partial();

/** `GET /menu/items`. */
export const itemsQuery = z.object({ outlet: key.optional(), all: z.enum(["1"]).optional() });

/** `POST /menu/items/:id/stock`. */
export const stockBody = z.object({ inStock: z.boolean() });

/** `PUT /menu/settings`. */
export const settingsBody = z.object({ outlets: z.array(z.object({ key, name: z.string().trim().min(2).max(60) })).max(30), clientOutlets: z.array(key).max(30) });
