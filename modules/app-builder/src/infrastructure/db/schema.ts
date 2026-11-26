/**
 * App Layout's own Postgres schema, `app_builder`. No other module reads it.
 * Layouts, their history and the layout rules are kept as settings rows:
 * `role:<roleId>`, `history:<roleId>` and `settings`.
 * Change this file, then run `pnpm db:generate`.
 */

import { moduleSettingsTable } from "@igongo/core";
import { pgSchema } from "drizzle-orm/pg-core";

export const appBuilderSchema = pgSchema("app_builder");

/** Every layout, history and rule, by key. */
export const settings = moduleSettingsTable(appBuilderSchema);
