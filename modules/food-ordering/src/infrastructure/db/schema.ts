/**
 * Food Ordering's own Postgres schema, `orders`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import type { DeliveryPlace } from "@igongo/contracts/food-ordering";
import { moduleSettingsTable } from "@igongo/core";
import { boolean, doublePrecision, index, integer, jsonb, pgSchema, primaryKey, smallint, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { OrderLine } from "../../domain/order-line";
import type { SavedCartLine } from "../../domain/saved-cart";
import type { StatusChange } from "../../domain/status-change";

export const ordersSchema = pgSchema("orders");

/** Every order, kept for ever (lines, prices and timeline included). */
export const orders = ordersSchema.table(
  "orders",
  {
    id: text("id").primaryKey(),
    seq: integer("seq").notNull(),
    userId: text("user_id"),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone"),
    outlet: text("outlet").notNull(),
    type: text("type", { enum: ["delivery", "room_service", "dine_in", "takeaway", "pre_order"] }).notNull(),
    channel: text("channel", { enum: ["app", "staff"] }).notNull(),
    status: text("status", { enum: ["awaiting_payment", "received", "preparing", "ready", "on_the_way", "delivered", "cancelled"] }).notNull(),
    lines: jsonb("lines").$type<OrderLine[]>().notNull(),
    notes: text("notes"),
    allergies: text("allergies"),
    table: text("table_label"),
    deliverTo: jsonb("deliver_to").$type<DeliveryPlace | null>(),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull().default(0),
    promoCode: text("promo_code"),
    pointsSpent: integer("points_spent").notNull().default(0),
    pointsDiscount: integer("points_discount").notNull().default(0),
    deliveryFee: integer("delivery_fee").notNull(),
    containerFee: integer("container_fee").notNull().default(0),
    total: integer("total").notNull(),
    paid: integer("paid").notNull(),
    arriveAt: timestamp("arrive_at", { withTimezone: true }),
    readyAt: timestamp("ready_at", { withTimezone: true }).notNull(),
    takenBy: text("taken_by"),
    requestKey: text("request_key"),
    history: jsonb("history").$type<StatusChange[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  // Ticket numbers never repeat; boards read by outlet and status; one order per checkout key per person.
  (t) => [
    uniqueIndex("orders_seq_key").on(t.seq),
    index("orders_board_idx").on(t.outlet, t.status, t.readyAt),
    index("orders_user_idx").on(t.userId, t.createdAt),
    uniqueIndex("orders_request_key").on(t.userId, t.requestKey),
  ],
);

/** Guests' ratings and reviews of their orders, one per order (S62-11). */
export const ratings = ordersSchema.table(
  "ratings",
  {
    orderId: text("order_id").primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    outlet: text("outlet").notNull(),
    itemIds: text("item_ids").array().notNull(),
    food: smallint("food").notNull(),
    delivery: smallint("delivery"),
    comment: text("comment"),
    hidden: boolean("hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  // The menu shows each outlet's newest reviews.
  (t) => [index("ratings_outlet_idx").on(t.outlet, t.createdAt)],
);

/**
 * Each guest's saved cart: one row per guest (their user ID is the key), so
 * a guest only ever reads and writes their own. Lines are the app's last
 * picks; checkout prices them again.
 */
export const carts = ordersSchema.table("carts", {
  userId: text("user_id").primaryKey(),
  outlet: text("outlet"),
  lines: jsonb("lines").$type<SavedCartLine[]>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

/**
 * Each guest's saved delivery pin (the map point they chose): one row per
 * guest, keyed by their user ID, so a guest only ever reads their own.
 */
export const deliveryPins = ordersSchema.table("delivery_pins", {
  userId: text("user_id").primaryKey(),
  label: text("label").notNull(),
  zone: text("zone"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

/** The ordering rules (key `rules`). */
export const settings = moduleSettingsTable(ordersSchema);

/**
 * Each guest's saved dishes (the heart on a dish): one row per guest and
 * dish, so a guest only ever reads and changes their own list.
 */
export const savedDishes = ordersSchema.table(
  "saved_dishes",
  {
    userId: text("user_id").notNull(),
    itemId: text("item_id").notNull(),
    outlet: text("outlet").notNull(),
    savedAt: timestamp("saved_at", { withTimezone: true }).notNull(),
  },
  // One row per guest and dish; the newest-first list reads by guest.
  (t) => [primaryKey({ columns: [t.userId, t.itemId] }), index("saved_dishes_user_idx").on(t.userId, t.savedAt)],
);
