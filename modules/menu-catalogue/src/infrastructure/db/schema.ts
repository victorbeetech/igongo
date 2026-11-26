/**
 * Menus & Catalogue's own Postgres schema, `menu`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import type { OptionGroup } from "@igongo/contracts/menu-catalogue";
import { moduleSettingsTable } from "@igongo/core";
import { boolean, index, integer, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const menuSchema = pgSchema("menu");

/** Every item every outlet sells. Items are switched off, never deleted, so old orders keep their names. */
export const items = menuSchema.table(
  "items",
  {
    id: text("id").primaryKey(),
    outlet: text("outlet").notNull(),
    section: text("section").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    prepMinutes: integer("prep_minutes").notNull(),
    options: jsonb("options").$type<OptionGroup[]>().notNull(),
    tags: jsonb("tags").$type<string[]>().notNull(),
    allergens: jsonb("allergens").$type<string[]>().notNull(),
    photoUrl: text("photo_url"),
    active: boolean("active").notNull(),
    visibleToClients: boolean("visible_to_clients").notNull(),
    outOfStockOn: text("out_of_stock_on"),
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("items_outlet_idx").on(t.outlet, t.section, t.sortOrder)],
);

/** The outlets list (key `menu`). */
export const settings = moduleSettingsTable(menuSchema);
