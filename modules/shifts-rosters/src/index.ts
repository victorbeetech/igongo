/**
 * Shifts and rosters (module 26) of the Igongo API. The gateway imports only
 * this file. See modules/shifts-rosters/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { shiftsRostersModule } from "./domain/shifts-rosters-module";
import { shiftsRostersTables } from "./infrastructure/db/schema";

export { shiftsRostersModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const shiftsRostersDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(shiftsRostersModule, shiftsRostersTables, db, change, staff);

/** The routes, mounted at `/api/shifts`. */
export const shiftsRostersRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(shiftsRostersModule.key, deps);

/** This module's numbers for the management dashboard. */
export const shiftsRostersKpis = (db: Database) => recordKpis(shiftsRostersModule, shiftsRostersTables, db, "Shifts and rosters");
