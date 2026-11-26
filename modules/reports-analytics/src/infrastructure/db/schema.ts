/**
 * Reports & Analytics' own Postgres schema, `analytics`: only its settings.
 * The numbers come from each module's KPI source. Change this file, then
 * run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { pgSchema } from "drizzle-orm/pg-core";

export const analyticsSchema = pgSchema("analytics");

/** The dashboard settings (key `dashboard`). */
export const settings = moduleSettingsTable(analyticsSchema);
