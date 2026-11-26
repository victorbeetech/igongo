/**
 * Cash-up (module 79) of the Igongo API. The gateway imports only
 * this file. See modules/cash-up/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { cashUpModule } from "./domain/cash-up-module";
import { cashUpTables } from "./infrastructure/db/schema";

export { cashUpModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const cashUpDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(cashUpModule, cashUpTables, db, change, staff);

/** The routes, mounted at `/api/cash-up`. */
export const cashUpRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(cashUpModule.key, deps);

/** This module's numbers for the management dashboard. */
export const cashUpKpis = (db: Database) => recordKpis(cashUpModule, cashUpTables, db, "Cash-up");
