/**
 * Laundry (module 44) of the Igongo API. The gateway imports only
 * this file. See modules/laundry/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { laundryModule } from "./domain/laundry-module";
import { laundryTables } from "./infrastructure/db/schema";

export { laundryModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const laundryDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(laundryModule, laundryTables, db, change, staff);

/** The routes, mounted at `/api/laundry`. */
export const laundryRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(laundryModule.key, deps);

/** This module's numbers for the management dashboard. */
export const laundryKpis = (db: Database) => recordKpis(laundryModule, laundryTables, db, "Laundry");
