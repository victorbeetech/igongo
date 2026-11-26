/**
 * Staff requests and welfare (module 36) of the Igongo API. The gateway imports only
 * this file. See modules/staff-welfare/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { staffWelfareModule } from "./domain/staff-welfare-module";
import { staffWelfareTables } from "./infrastructure/db/schema";

export { staffWelfareModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const staffWelfareDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(staffWelfareModule, staffWelfareTables, db, change, staff);

/** The routes, mounted at `/api/welfare`. */
export const staffWelfareRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(staffWelfareModule.key, deps);

/** This module's numbers for the management dashboard. */
export const staffWelfareKpis = (db: Database) => recordKpis(staffWelfareModule, staffWelfareTables, db, "Staff requests and welfare");
