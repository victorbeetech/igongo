/**
 * Recruitment (module 23) of the Igongo API. The gateway imports only
 * this file. See modules/recruitment/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { recruitmentModule } from "./domain/recruitment-module";
import { recruitmentTables } from "./infrastructure/db/schema";

export { recruitmentModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const recruitmentDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(recruitmentModule, recruitmentTables, db, change, staff);

/** The routes, mounted at `/api/recruitment`. */
export const recruitmentRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(recruitmentModule.key, deps);

/** This module's numbers for the management dashboard. */
export const recruitmentKpis = (db: Database) => recordKpis(recruitmentModule, recruitmentTables, db, "Recruitment");
