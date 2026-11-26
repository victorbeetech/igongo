/**
 * Onboarding and exit's own Postgres schema, `onboarding`, with the records
 * kit's tables (records, record_events, settings). No other module reads
 * these tables. Change the kit or this file, then run `pnpm db:generate`.
 */

import { recordTables } from "@igongo/records-kit";
import { pgSchema } from "drizzle-orm/pg-core";

export const onboardingExitSchema = pgSchema("onboarding");

export const { records, events, settings } = recordTables(onboardingExitSchema);

/** The tables together, for the kit's repository. */
export const onboardingExitTables = { records, events, settings };
