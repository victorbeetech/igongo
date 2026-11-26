/**
 * Lost and found (module 46) of the Igongo API. The gateway imports only
 * this file. See modules/lost-found/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { lostFoundModule } from "./domain/lost-found-module";
import { lostFoundTables } from "./infrastructure/db/schema";

export { lostFoundModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const lostFoundDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(lostFoundModule, lostFoundTables, db, change, staff);

/** The routes, mounted at `/api/lost-found`. */
export const lostFoundRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(lostFoundModule.key, deps);

/** This module's numbers for the management dashboard. */
export const lostFoundKpis = (db: Database) => recordKpis(lostFoundModule, lostFoundTables, db, "Lost and found");
