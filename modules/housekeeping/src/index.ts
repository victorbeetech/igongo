/**
 * Housekeeping (module 43) of the Igongo API. The gateway imports only
 * this file. See modules/housekeeping/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { housekeepingModule } from "./domain/housekeeping-module";
import { housekeepingTables } from "./infrastructure/db/schema";

export { housekeepingModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const housekeepingDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(housekeepingModule, housekeepingTables, db, change, staff);

/** The routes, mounted at `/api/housekeeping`. */
export const housekeepingRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(housekeepingModule.key, deps);

/** This module's numbers for the management dashboard. */
export const housekeepingKpis = (db: Database) => recordKpis(housekeepingModule, housekeepingTables, db, "Housekeeping");
