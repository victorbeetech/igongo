/**
 * Organisation (module 15) of the Igongo API. The gateway imports only
 * this file. See modules/locations-departments/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { locationsDepartmentsModule } from "./domain/locations-departments-module";
import { locationsDepartmentsTables } from "./infrastructure/db/schema";

export { locationsDepartmentsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const locationsDepartmentsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(locationsDepartmentsModule, locationsDepartmentsTables, db, change, staff);

/** The routes, mounted at `/api/org`. */
export const locationsDepartmentsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(locationsDepartmentsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const locationsDepartmentsKpis = (db: Database) => recordKpis(locationsDepartmentsModule, locationsDepartmentsTables, db, "Organisation");
