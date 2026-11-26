/** Zod schemas for Stock & Inventory's request bodies and queries. */

import { FIELD_KINDS } from "@igongo/records-kit";
import { z } from "zod";
import { MOVEMENT_KINDS } from "../domain/movement";

const name = z.string().trim().min(1).max(120);
const qty = z.number().positive().max(1_000_000_000);
const id = z.string().max(80);
const optText = z.string().trim().max(500).nullable().optional();

/** `POST /stores`, and `PATCH /stores/:id` (any of them). */
export const storeBody = z.object({
  name,
  kind: z.string().trim().min(1).max(60),
  department: z.string().trim().max(60).nullable().default(null),
  keeperStaffId: id.nullable().default(null),
  location: z.string().trim().max(120).nullable().default(null),
  active: z.boolean().default(true),
});
export const storePatch = storeBody.partial();

/** `POST /items`, and `PATCH /items/:id` (any of them). */
export const itemBody = z.object({
  code: z.string().trim().min(1).max(40),
  name,
  category: z.string().trim().min(1).max(60),
  unit: z.string().trim().min(1).max(30),
  conversions: z.array(z.object({ unit: z.string().trim().min(1).max(30), per: qty })).max(10).default([]),
  reorderLevel: z.number().min(0).max(1_000_000_000).default(0),
  tracksExpiry: z.boolean().default(false),
  photoId: id.nullable().default(null),
  extra: z.record(z.string().max(40), z.union([z.string().max(2000), z.number(), z.boolean(), z.null()])).default({}),
  active: z.boolean().default(true),
});
export const itemPatch = itemBody.partial();

/** `POST /movements`. */
export const movementBody = z.object({
  kind: z.enum(MOVEMENT_KINDS).exclude(["count"]),
  itemId: id,
  qty,
  unit: z.string().trim().max(30).optional(),
  fromStoreId: id.nullable().optional(),
  toStoreId: id.nullable().optional(),
  unitCost: z.number().int().min(0).max(1_000_000_000).optional(),
  reference: optText,
  issuedTo: optText,
  batch: optText,
  expiresOn: z.iso.date().nullable().optional(),
  note: optText,
});

/** `POST /counts`: one item counted in one store. */
export const countBody = z.object({ itemId: id, storeId: id, counted: z.number().min(0).max(1_000_000_000), reference: optText, note: optText });

/** `GET /movements`. */
export const movementQuery = z.object({ itemId: id.optional(), storeId: id.optional(), kind: z.enum(MOVEMENT_KINDS).optional(), from: z.iso.date().optional(), to: z.iso.date().optional() });

/** `GET /items`. */
export const itemQuery = z.object({ q: z.string().trim().max(80).optional(), category: z.string().max(60).optional(), all: z.literal("1").optional() });

/** `PUT /settings`. */
export const settingsBody = z.object({
  categories: z.array(z.string().trim().min(1).max(60)).min(1).max(100),
  units: z.array(z.string().trim().min(1).max(30)).min(1).max(100),
  allowNegative: z.boolean(),
  reasonRequired: z.boolean(),
  itemFields: z.array(z.object({ key: z.string().regex(/^[a-z][a-z0-9_]{0,39}$/), label: name, kind: z.enum(FIELD_KINDS), required: z.boolean().optional(), options: z.array(z.string().max(80)).max(60).optional(), inList: z.boolean().optional() })).max(40),
});
