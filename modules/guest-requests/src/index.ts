/**
 * Guest requests (module 60) of the Igongo API. The gateway imports only
 * this file. See modules/guest-requests/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { guestRequestsModule } from "./domain/guest-requests-module";
import { guestRequestsTables } from "./infrastructure/db/schema";

export { guestRequestsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const guestRequestsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(guestRequestsModule, guestRequestsTables, db, change, staff);

/** The routes, mounted at `/api/guest-requests`. */
export const guestRequestsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(guestRequestsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const guestRequestsKpis = (db: Database) => recordKpis(guestRequestsModule, guestRequestsTables, db, "Guest requests");
