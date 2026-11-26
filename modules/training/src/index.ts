/**
 * Training (module 34) of the Igongo API. The gateway imports only
 * this file. See modules/training/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { trainingModule } from "./domain/training-module";
import { trainingTables } from "./infrastructure/db/schema";

export { trainingModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const trainingDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(trainingModule, trainingTables, db, change, staff);

/** The routes, mounted at `/api/training`. */
export const trainingRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(trainingModule.key, deps);

/** This module's numbers for the management dashboard. */
export const trainingKpis = (db: Database) => recordKpis(trainingModule, trainingTables, db, "Training");
