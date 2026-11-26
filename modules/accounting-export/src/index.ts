/**
 * Accounting export (module 80) of the Igongo API. The gateway imports only
 * this file. See modules/accounting-export/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { accountingExportModule } from "./domain/accounting-export-module";
import { accountingExportTables } from "./infrastructure/db/schema";

export { accountingExportModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const accountingExportDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(accountingExportModule, accountingExportTables, db, change, staff);

/** The routes, mounted at `/api/accounting`. */
export const accountingExportRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(accountingExportModule.key, deps);

/** This module's numbers for the management dashboard. */
export const accountingExportKpis = (db: Database) => recordKpis(accountingExportModule, accountingExportTables, db, "Accounting export");
