/**
 * Kitchen production (module 63) of the Igongo API. The gateway imports only
 * this file. See modules/kitchen-display/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { kitchenDisplayModule } from "./domain/kitchen-display-module";
import { kitchenDisplayTables } from "./infrastructure/db/schema";

export { kitchenDisplayModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const kitchenDisplayDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(kitchenDisplayModule, kitchenDisplayTables, db, change, staff);

/** The routes, mounted at `/api/kitchen`. */
export const kitchenDisplayRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(kitchenDisplayModule.key, deps);

/** This module's numbers for the management dashboard. */
export const kitchenDisplayKpis = (db: Database) => recordKpis(kitchenDisplayModule, kitchenDisplayTables, db, "Kitchen production");
