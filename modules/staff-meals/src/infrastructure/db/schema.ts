/**
 * Staff Meals' own Postgres schema, `meals`. No other module reads these
 * tables. Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { index, pgSchema, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { CLAIM_METHODS } from "../../domain/meal-claim";

export const mealsSchema = pgSchema("meals");

export const claimMethod = mealsSchema.enum("claim_method", CLAIM_METHODS);

/** Every meal served, kept for ever (for payroll deductions and reports). */
export const mealClaims = mealsSchema.table(
  "meal_claims",
  {
    id: text("id").primaryKey(),
    staffId: text("staff_id").notNull(),
    department: text("department"),
    workDate: text("work_date").notNull(),
    mealKey: text("meal_key").notNull(),
    method: claimMethod("method").notNull(),
    servedBy: text("served_by"),
    at: timestamp("at", { withTimezone: true }).notNull(),
  },
  // The database itself refuses a second serving of the same meal.
  (t) => [uniqueIndex("meal_claims_once_key").on(t.staffId, t.workDate, t.mealKey), index("meal_claims_day_idx").on(t.workDate, t.department)],
);

/** The meal rules (key `rules`). */
export const settings = moduleSettingsTable(mealsSchema);
