/**
 * Meetings (module 51) of the Igongo API. The gateway imports only
 * this file. See modules/meetings/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { meetingsModule } from "./domain/meetings-module";
import { meetingsTables } from "./infrastructure/db/schema";

export { meetingsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const meetingsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(meetingsModule, meetingsTables, db, change, staff);

/** The routes, mounted at `/api/meetings`. */
export const meetingsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(meetingsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const meetingsKpis = (db: Database) => recordKpis(meetingsModule, meetingsTables, db, "Meetings");
