/**
 * Points rewards' own Postgres schema, `points_rewards`:
 *  - `settings`: the rules document (key `rules`), set by the super admin
 *  - `lots`: each batch of points a guest earned, and what is left of it
 *  - `events`: the guest's points history (every change, with its source)
 *
 * Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { integer, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const pointsSchema = pgSchema("points_rewards");

/** The rules document, stored under the key `rules`. */
export const settings = moduleSettingsTable(pointsSchema);

/** One batch of points earned by a guest. */
export const lots = pointsSchema.table(
  "lots",
  {
    id: text("id").primaryKey(),
    guestId: text("guest_id").notNull(),
    earned: integer("earned").notNull(),
    remaining: integer("remaining").notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    /** The event that created the lot. Unique, so one source never adds points twice. */
    sourceRef: text("source_ref").notNull(),
  },
  (t) => [uniqueIndex("lots_source_ref_key").on(t.sourceRef)],
);

/** One line of a guest's points history. */
export const events = pointsSchema.table(
  "events",
  {
    id: text("id").primaryKey(),
    guestId: text("guest_id").notNull(),
    kind: text("kind").notNull(),
    points: integer("points").notNull(),
    /** Unique per change, so a retry of the same change is refused. */
    sourceRef: text("source_ref").notNull(),
    note: text("note").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("events_source_ref_key").on(t.sourceRef)],
);
