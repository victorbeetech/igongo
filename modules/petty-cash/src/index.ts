/**
 * Petty cash (module 37) of the Igongo API. The gateway imports only
 * this file. See modules/petty-cash/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { pettyCashModule } from "./domain/petty-cash-module";
import { pettyCashTables } from "./infrastructure/db/schema";

export { pettyCashModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const pettyCashDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(pettyCashModule, pettyCashTables, db, change, staff);

/** The routes, mounted at `/api/petty-cash`. */
export const pettyCashRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(pettyCashModule.key, deps);

/** This module's numbers for the management dashboard. */
export const pettyCashKpis = (db: Database) => recordKpis(pettyCashModule, pettyCashTables, db, "Petty cash");
