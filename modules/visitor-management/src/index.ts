/**
 * Visitors (module 20) of the Igongo API. The gateway imports only
 * this file. See modules/visitor-management/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { visitorManagementModule } from "./domain/visitor-management-module";
import { visitorManagementTables } from "./infrastructure/db/schema";

export { visitorManagementModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const visitorManagementDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(visitorManagementModule, visitorManagementTables, db, change, staff);

/** The routes, mounted at `/api/visitors`. */
export const visitorManagementRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(visitorManagementModule.key, deps);

/** This module's numbers for the management dashboard. */
export const visitorManagementKpis = (db: Database) => recordKpis(visitorManagementModule, visitorManagementTables, db, "Visitors");
