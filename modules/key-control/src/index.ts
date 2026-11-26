/**
 * Key control (module 21) of the Igongo API. The gateway imports only
 * this file. See modules/key-control/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { keyControlModule } from "./domain/key-control-module";
import { keyControlTables } from "./infrastructure/db/schema";

export { keyControlModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const keyControlDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(keyControlModule, keyControlTables, db, change, staff);

/** The routes, mounted at `/api/keys`. */
export const keyControlRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(keyControlModule.key, deps);

/** This module's numbers for the management dashboard. */
export const keyControlKpis = (db: Database) => recordKpis(keyControlModule, keyControlTables, db, "Key control");
