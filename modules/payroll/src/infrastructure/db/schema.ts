/**
 * Payroll's own Postgres schema, `payroll`. No other module reads these
 * tables. Change this file, then run `pnpm db:generate`.
 */

import type { AdvanceDue } from "@igongo/contracts/advances-loans";
import type { PayLine } from "@igongo/contracts/payroll";
import { moduleSettingsTable } from "@igongo/core";
import { bigint, boolean, index, integer, jsonb, pgSchema, text, timestamp } from "drizzle-orm/pg-core";

export const payrollSchema = pgSchema("payroll");

/** One pay profile per staff member. */
export const payProfiles = payrollSchema.table("pay_profiles", {
  staffId: text("staff_id").primaryKey(),
  basic: bigint("basic", { mode: "number" }).notNull(),
  allowances: jsonb("allowances").$type<PayLine[]>().notNull(),
  payMethod: text("pay_method").notNull(),
  account: text("account"),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

/** Pay runs, kept for ever. */
export const payRuns = payrollSchema.table(
  "pay_runs",
  {
    id: text("id").primaryKey(),
    period: text("period").notNull(),
    status: text("status").notNull(),
    staffCount: integer("staff_count").notNull(),
    gross: bigint("gross", { mode: "number" }).notNull(),
    deductions: bigint("deductions", { mode: "number" }).notNull(),
    net: bigint("net", { mode: "number" }).notNull(),
    employerCost: bigint("employer_cost", { mode: "number" }).notNull(),
    createdById: text("created_by_id").notNull(),
    createdByName: text("created_by_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    approvedByName: text("approved_by_name"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    paidByName: text("paid_by_name"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [index("pay_runs_period_idx").on(t.period)],
);

/** Payslips: one per person per run. */
export const payslips = payrollSchema.table(
  "payslips",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => payRuns.id),
    period: text("period").notNull(),
    staffId: text("staff_id").notNull(),
    staffName: text("staff_name").notNull(),
    staffNumber: text("staff_number").notNull(),
    department: text("department"),
    basic: bigint("basic", { mode: "number" }).notNull(),
    earnings: jsonb("earnings").$type<PayLine[]>().notNull(),
    gross: bigint("gross", { mode: "number" }).notNull(),
    deductions: jsonb("deductions").$type<PayLine[]>().notNull(),
    totalDeductions: bigint("total_deductions", { mode: "number" }).notNull(),
    net: bigint("net", { mode: "number" }).notNull(),
    employer: jsonb("employer").$type<PayLine[]>().notNull(),
    adjustments: jsonb("adjustments").$type<PayLine[]>().notNull(),
    bonusIds: text("bonus_ids").array().notNull(),
    advanceLines: jsonb("advance_lines").$type<AdvanceDue[]>().notNull(),
  },
  (t) => [index("payslips_run_idx").on(t.runId), index("payslips_staff_idx").on(t.staffId, t.period)],
);

/** Deductions and approval rule (key `settings`). */
export const settings = moduleSettingsTable(payrollSchema);
