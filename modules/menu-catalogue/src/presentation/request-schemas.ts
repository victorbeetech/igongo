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

/** `POST /menu/outlets`: a new venue's name (2 to 60 letters) and whether guests see it straight away. */
export const outletBody = z.object({ name: z.string().trim().min(2).max(60), clientVisible: z.boolean().default(true) });

/** `PATCH /menu/outlets/:key`: any of the name and the guest switch; at least one is needed. */
export const outletPatch = z
  .object({ name: z.string().trim().min(2).max(60).optional(), clientVisible: z.boolean().optional() })
  .refine((v) => v.name !== undefined || v.clientVisible !== undefined, { message: "Change the name or the guest switch." });

/** `PUT /menu/settings`. */
export const settingsBody = z.object({ outlets: z.array(z.object({ key, name: z.string().trim().min(2).max(60) })).max(30), clientOutlets: z.array(key).max(30) });

/** `GET /menu/search?q=`: what the guest typed in global search, 2 to 60 characters once trimmed. */
export const searchQuery = z.object({ q: z.string().trim().min(2).max(60) });
