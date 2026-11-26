/**
 * Assets (module 41) of the Igongo API. The gateway imports only
 * this file. See modules/asset-register/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { assetRegisterModule } from "./domain/asset-register-module";
import { assetRegisterTables } from "./infrastructure/db/schema";

export { assetRegisterModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const assetRegisterDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(assetRegisterModule, assetRegisterTables, db, change, staff);

/** The routes, mounted at `/api/assets`. */
export const assetRegisterRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(assetRegisterModule.key, deps);

/** This module's numbers for the management dashboard. */
export const assetRegisterKpis = (db: Database) => recordKpis(assetRegisterModule, assetRegisterTables, db, "Assets");
