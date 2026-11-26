/**
 * Advances & Loans' own Postgres schema, `advances`. No other module reads
 * these tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { bigint, index, integer, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const advancesSchema = pgSchema("advances");

/** Every advance and loan, kept for ever. */
export const advances = advancesSchema.table(
  "advances",
  {
    id: text("id").primaryKey(),
    number: text("number").notNull().unique(),
    staffId: text("staff_id").notNull(),
    staffName: text("staff_name").notNull(),
    department: text("department"),
    kind: text("kind").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    reason: text("reason").notNull(),
    instalments: integer("instalments").notNull(),
    instalmentAmount: bigint("instalment_amount", { mode: "number" }).notNull(),
    startPeriod: text("start_period").notNull(),
    status: text("status").notNull(),
    repaid: bigint("repaid", { mode: "number" }).notNull().default(0),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull(),
    decidedByName: text("decided_by_name"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decisionNote: text("decision_note"),
    disbursedByName: text("disbursed_by_name"),
    disbursedAt: timestamp("disbursed_at", { withTimezone: true }),
  },
  (t) => [index("advances_staff_idx").on(t.staffId, t.requestedAt), index("advances_status_idx").on(t.status)],
);

/** Money taken back. One pay-run instalment per advance per month. */
export const repayments = advancesSchema.table(
  "repayments",
  {
    id: text("id").primaryKey(),
    advanceId: text("advance_id")
      .notNull()
      .references(() => advances.id),
    period: text("period").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    payRunId: text("pay_run_id"),
    byName: text("by_name").notNull(),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  (t) => [uniqueIndex("repayments_run_uq").on(t.advanceId, t.period, t.payRunId), index("repayments_advance_idx").on(t.advanceId, t.at)],
);

/** The rules (key `rules`). */
export const settings = moduleSettingsTable(advancesSchema);
