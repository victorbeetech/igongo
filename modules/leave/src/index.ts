/**
 * Leave (module 27) of the Igongo API. The gateway imports only
 * this file. See modules/leave/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { leaveModule } from "./domain/leave-module";
import { leaveTables } from "./infrastructure/db/schema";

export { leaveModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const leaveDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(leaveModule, leaveTables, db, change, staff);

/** The routes, mounted at `/api/leave`. */
export const leaveRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(leaveModule.key, deps);

/** This module's numbers for the management dashboard. */
export const leaveKpis = (db: Database) => recordKpis(leaveModule, leaveTables, db, "Leave");
