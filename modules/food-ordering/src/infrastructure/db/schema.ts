/**
 * Food Ordering's own Postgres schema, `orders`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import type { DeliveryPlace } from "@igongo/contracts/food-ordering";
import { moduleSettingsTable } from "@igongo/core";
import { index, integer, jsonb, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import type { OrderLine } from "../../domain/order-line";
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
    deliveryFee: integer("delivery_fee").notNull(),
    total: integer("total").notNull(),
    paid: integer("paid").notNull(),
    arriveAt: timestamp("arrive_at", { withTimezone: true }),
    readyAt: timestamp("ready_at", { withTimezone: true }).notNull(),
    takenBy: text("taken_by"),
    history: jsonb("history").$type<StatusChange[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  // Ticket numbers never repeat; boards read by outlet and status.
  (t) => [uniqueIndex("orders_seq_key").on(t.seq), index("orders_board_idx").on(t.outlet, t.status, t.readyAt), index("orders_user_idx").on(t.userId, t.createdAt)],
);

/** The ordering rules (key `rules`). */
export const settings = moduleSettingsTable(ordersSchema);
