/**
 * Loyalty (module 57) of the Igongo API. The gateway imports only
 * this file. See modules/loyalty/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { loyaltyModule } from "./domain/loyalty-module";
import { loyaltyTables } from "./infrastructure/db/schema";

export { loyaltyModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const loyaltyDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(loyaltyModule, loyaltyTables, db, change, staff);

/** The routes, mounted at `/api/loyalty`. */
export const loyaltyRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(loyaltyModule.key, deps);

/** This module's numbers for the management dashboard. */
export const loyaltyKpis = (db: Database) => recordKpis(loyaltyModule, loyaltyTables, db, "Loyalty");
