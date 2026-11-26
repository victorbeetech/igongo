/**
 * Buffet (module 65) of the Igongo API. The gateway imports only
 * this file. See modules/buffet/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { buffetModule } from "./domain/buffet-module";
import { buffetTables } from "./infrastructure/db/schema";

export { buffetModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const buffetDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(buffetModule, buffetTables, db, change, staff);

/** The routes, mounted at `/api/buffet`. */
export const buffetRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(buffetModule.key, deps);

/** This module's numbers for the management dashboard. */
export const buffetKpis = (db: Database) => recordKpis(buffetModule, buffetTables, db, "Buffet");
