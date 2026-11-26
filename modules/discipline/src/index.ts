/**
 * Discipline (module 35) of the Igongo API. The gateway imports only
 * this file. See modules/discipline/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { disciplineModule } from "./domain/discipline-module";
import { disciplineTables } from "./infrastructure/db/schema";

export { disciplineModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const disciplineDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(disciplineModule, disciplineTables, db, change, staff);

/** The routes, mounted at `/api/discipline`. */
export const disciplineRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(disciplineModule.key, deps);

/** This module's numbers for the management dashboard. */
export const disciplineKpis = (db: Database) => recordKpis(disciplineModule, disciplineTables, db, "Discipline");
