/**
 * Bonuses & Rewards' own Postgres schema, `bonuses`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { bigint, date, index, integer, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const bonusesSchema = pgSchema("bonuses");

/** Every bonus, kept for ever. */
export const bonuses = bonusesSchema.table(
  "bonuses",
  {
    id: text("id").primaryKey(),
    staffId: text("staff_id").notNull(),
    staffName: text("staff_name").notNull(),
    department: text("department"),
    kind: text("kind").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    passes: integer("passes").notNull(),
    passesUsed: integer("passes_used").notNull().default(0),
    validUntil: date("valid_until", { mode: "string" }),
    reason: text("reason").notNull(),
    status: text("status").notNull(),
    awardedByName: text("awarded_by_name").notNull(),
    decidedByName: text("decided_by_name"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    payRunId: text("pay_run_id"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("bonuses_staff_idx").on(t.staffId, t.createdAt), index("bonuses_status_idx").on(t.kind, t.status)],
);

/** Every buffet pass used. */
export const buffetUses = bonusesSchema.table(
  "buffet_uses",
  {
    id: text("id").primaryKey(),
    bonusId: text("bonus_id")
      .notNull()
      .references(() => bonuses.id),
    staffId: text("staff_id").notNull(),
    workDate: date("work_date", { mode: "string" }).notNull(),
    servedByName: text("served_by_name").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [index("buffet_uses_staff_idx").on(t.staffId, t.workDate)],
);

/** The rules (key `rules`). */
export const settings = moduleSettingsTable(bonusesSchema);
