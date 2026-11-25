/**
 * Wristbands' own Postgres schema, `bands`. No other module reads these
 * tables. Change this file, then run `pnpm db:generate`.
 */

import { index, integer, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { SCAN_RESULTS } from "../../domain/band-scan";
import { BAND_STATUSES } from "../../domain/wristband";

export const bandsSchema = pgSchema("bands");

export const bandStatus = bandsSchema.enum("band_status", BAND_STATUSES);
export const scanResult = bandsSchema.enum("scan_result", SCAN_RESULTS);

/** One row per physical band, registered once and reused for ever. */
export const wristbands = bandsSchema.table(
  "wristbands",
  {
    bandNumber: integer("band_number").primaryKey(),
    uid: text("uid"),
    qrToken: text("qr_token").notNull(),
    bandType: text("band_type").notNull(),
    status: bandStatus("status").notNull().default("in_stock"),
    eventKey: text("event_key"),
    eventName: text("event_name"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("wristbands_uid_key").on(t.uid), index("wristbands_event_idx").on(t.eventKey), index("wristbands_status_idx").on(t.status)],
);

/** Every scan at every door, kept for the scan log (S17-10). */
export const bandScans = bandsSchema.table(
  "band_scans",
  {
    id: text("id").primaryKey(),
    bandNumber: integer("band_number"),
    eventKey: text("event_key"),
    result: scanResult("result").notNull(),
    actorId: text("actor_id"),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("band_scans_event_idx").on(t.eventKey, t.at), index("band_scans_band_idx").on(t.bandNumber, t.at)],
);
