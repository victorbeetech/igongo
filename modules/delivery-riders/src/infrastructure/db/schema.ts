/**
 * Delivery & Riders' own Postgres schema, `delivery`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import type { DeliveryPlace } from "@igongo/contracts/food-ordering";
import { moduleSettingsTable } from "@igongo/core";
import { boolean, doublePrecision, index, integer, jsonb, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { DELIVERY_SOURCES } from "@igongo/contracts/delivery-riders";
import { JOB_STATUSES } from "../../domain/delivery-job";

export const deliverySchema = pgSchema("delivery");

/** Every delivery, kept for ever (trips, earnings and cash). */
export const jobs = deliverySchema.table(
  "jobs",
  {
    id: text("id").primaryKey(),
    source: text("source", { enum: DELIVERY_SOURCES }).notNull().default("food"),
    orderId: text("order_id").notNull(),
    orderNumber: text("order_number").notNull(),
    what: text("what"),
    customerUserId: text("customer_user_id"),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone"),
    place: jsonb("place").$type<DeliveryPlace>().notNull(),
    fee: integer("fee").notNull(),
    minutes: integer("minutes").notNull(),
    cashToCollect: integer("cash_to_collect").notNull(),
    status: text("status", { enum: JOB_STATUSES }).notNull(),
    riderUserId: text("rider_user_id"),
    riderName: text("rider_name"),
    code: text("code").notNull(),
    cashCollected: integer("cash_collected").notNull(),
    cashHandedIn: boolean("cash_handed_in").notNull(),
    failReason: text("fail_reason"),
    openedAt: timestamp("opened_at", { withTimezone: true }).notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true }),
    pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  // One job per record of each source; riders, guests and the board read by person and status.
  (t) => [
    uniqueIndex("jobs_source_order_key").on(t.source, t.orderId),
    index("jobs_status_idx").on(t.status, t.openedAt),
    index("jobs_rider_idx").on(t.riderUserId, t.openedAt),
    index("jobs_customer_idx").on(t.customerUserId, t.openedAt),
  ],
);

/** Each rider's live status and last location. */
export const riders = deliverySchema.table("riders", {
  userId: text("user_id").primaryKey(),
  name: text("name").notNull(),
  online: boolean("online").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  locationAt: timestamp("location_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

/** The delivery rules (key `rules`). */
export const settings = moduleSettingsTable(deliverySchema);
