/**
 * The tables every booking module has, each in its own Postgres schema
 * (`rooms`, `museum`, `events`, `pool`, `shop`): offerings, bookings and
 * settings. One shape, so the kit's repositories work for all of them,
 * while no module ever reads another's tables.
 *
 * @example export const tables = bookingTables(pgSchema("rooms"));
 */

import { moduleSettingsTable } from "@igongo/core";
import { boolean, index, integer, jsonb, text, timestamp, uniqueIndex, type PgSchema } from "drizzle-orm/pg-core";
import { BOOKING_STATUSES } from "../../domain/booking";
import { OFFERING_KINDS } from "../../domain/offering";

export function bookingTables(schema: PgSchema) {
  /** What the module sells. Switched off, never deleted, so old bookings keep their offering. */
  const offerings = schema.table("offerings", {
    id: text("id").primaryKey(),
    kind: text("kind", { enum: OFFERING_KINDS }).notNull(),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    capacity: integer("capacity").notNull(),
    slots: jsonb("slots").$type<string[]>().notNull(),
    onDate: text("on_date"),
    photoUrl: text("photo_url"),
    details: jsonb("details").$type<Record<string, string>>().notNull(),
    active: boolean("active").notNull(),
    visibleToClients: boolean("visible_to_clients").notNull(),
    sortOrder: integer("sort_order").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  });

  /** Every booking, kept for ever. */
  const bookings = schema.table(
    "bookings",
    {
      id: text("id").primaryKey(),
      code: text("code").notNull(),
      offeringId: text("offering_id").notNull(),
      offeringName: text("offering_name").notNull(),
      kind: text("kind", { enum: OFFERING_KINDS }).notNull(),
      userId: text("user_id"),
      guestName: text("guest_name").notNull(),
      guestPhone: text("guest_phone"),
      date: text("date"),
      endDate: text("end_date"),
      slot: text("slot"),
      units: integer("units").notNull(),
      total: integer("total").notNull(),
      paid: integer("paid").notNull(),
      status: text("status", { enum: BOOKING_STATUSES }).notNull(),
      notes: text("notes"),
      createdBy: text("created_by"),
      cancelReason: text("cancel_reason"),
      checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    },
    // Codes are unique; availability reads by offering and date.
    (t) => [uniqueIndex("bookings_code_key").on(t.code), index("bookings_offering_idx").on(t.offeringId, t.date), index("bookings_user_idx").on(t.userId, t.createdAt), index("bookings_day_idx").on(t.date, t.status)],
  );

  return { offerings, bookings, settings: moduleSettingsTable(schema) };
}

/** The tables of one booking module. */
export type BookingTables = ReturnType<typeof bookingTables>;
