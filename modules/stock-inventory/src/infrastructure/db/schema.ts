/**
 * Stock's own Postgres schema, `stock`: stores, items, the movements
 * ledger, and the records kit's desk tables (records, record_events) with
 * the settings table they share. No other module reads these tables.
 * Change this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import type { FieldValue } from "@igongo/records-kit";
import { boolean, index, integer, jsonb, numeric, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { MOVEMENT_KINDS } from "../../domain/movement";
import type { UnitConversion } from "../../domain/stock-item";

export const stockSchema = pgSchema("stock");

/** Stores and sub-stores. */
export const stores = stockSchema.table("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull(),
  department: text("department"),
  keeperStaffId: text("keeper_staff_id"),
  location: text("location"),
  active: boolean("active").notNull(),
});

/** Stock items. Quantities live in the ledger, not here. */
export const items = stockSchema.table(
  "items",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    unit: text("unit").notNull(),
    conversions: jsonb("conversions").$type<UnitConversion[]>().notNull(),
    reorderLevel: numeric("reorder_level", { precision: 14, scale: 3, mode: "number" }).notNull(),
    avgCost: integer("avg_cost").notNull(),
    tracksExpiry: boolean("tracks_expiry").notNull(),
    photoId: text("photo_id"),
    extra: jsonb("extra").$type<Record<string, FieldValue>>().notNull(),
    active: boolean("active").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("items_code_key").on(t.code), index("items_category_idx").on(t.category, t.name)],
);

/** The ledger: every stock change, kept for ever. */
export const movements = stockSchema.table(
  "movements",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull(),
    kind: text("kind", { enum: MOVEMENT_KINDS }).notNull(),
    itemId: text("item_id").notNull(),
    itemName: text("item_name").notNull(),
    fromStoreId: text("from_store_id"),
    toStoreId: text("to_store_id"),
    qty: numeric("qty", { precision: 14, scale: 3, mode: "number" }).notNull(),
    unitCost: integer("unit_cost").notNull(),
    reference: text("reference"),
    issuedTo: text("issued_to"),
    batch: text("batch"),
    expiresOn: text("expires_on"),
    note: text("note"),
    byId: text("by_id"),
    byName: text("by_name").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("movements_number_key").on(t.number), index("movements_item_idx").on(t.itemId, t.at), index("movements_from_idx").on(t.fromStoreId, t.itemId), index("movements_to_idx").on(t.toStoreId, t.itemId)],
);

/** The desk (requisitions, orders, suppliers, counts, recipes) and the shared settings table. */
export const { records, events, settings } = recordTables(stockSchema);

/** The desk's tables, for the records kit. */
export const deskTables = { records, events, settings };
