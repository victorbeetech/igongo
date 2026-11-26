/**
 * Campaigns (module 58) of the Igongo API. The gateway imports only
 * this file. See modules/campaigns/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { campaignsModule } from "./domain/campaigns-module";
import { campaignsTables } from "./infrastructure/db/schema";

export { campaignsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const campaignsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(campaignsModule, campaignsTables, db, change, staff);

/** The routes, mounted at `/api/campaigns`. */
export const campaignsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(campaignsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const campaignsKpis = (db: Database) => recordKpis(campaignsModule, campaignsTables, db, "Campaigns");
