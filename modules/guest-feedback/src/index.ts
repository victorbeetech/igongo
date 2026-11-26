/**
 * Feedback and complaints (module 56) of the Igongo API. The gateway imports only
 * this file. See modules/guest-feedback/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { guestFeedbackModule } from "./domain/guest-feedback-module";
import { guestFeedbackTables } from "./infrastructure/db/schema";

export { guestFeedbackModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const guestFeedbackDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(guestFeedbackModule, guestFeedbackTables, db, change, staff);

/** The routes, mounted at `/api/feedback`. */
export const guestFeedbackRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(guestFeedbackModule.key, deps);

/** This module's numbers for the management dashboard. */
export const guestFeedbackKpis = (db: Database) => recordKpis(guestFeedbackModule, guestFeedbackTables, db, "Feedback and complaints");
