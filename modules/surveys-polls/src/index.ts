/**
 * Surveys and polls (module 52) of the Igongo API. The gateway imports only
 * this file. See modules/surveys-polls/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { surveysPollsModule } from "./domain/surveys-polls-module";
import { surveysPollsTables } from "./infrastructure/db/schema";

export { surveysPollsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const surveysPollsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(surveysPollsModule, surveysPollsTables, db, change, staff);

/** The routes, mounted at `/api/surveys`. */
export const surveysPollsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(surveysPollsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const surveysPollsKpis = (db: Database) => recordKpis(surveysPollsModule, surveysPollsTables, db, "Surveys and polls");
