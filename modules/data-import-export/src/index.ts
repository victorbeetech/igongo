/**
 * Data jobs (module 13) of the Igongo API. The gateway imports only
 * this file. See modules/data-import-export/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { dataImportExportModule } from "./domain/data-import-export-module";
import { dataImportExportTables } from "./infrastructure/db/schema";

export { dataImportExportModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const dataImportExportDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(dataImportExportModule, dataImportExportTables, db, change, staff);

/** The routes, mounted at `/api/data-jobs`. */
export const dataImportExportRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(dataImportExportModule.key, deps);

/** This module's numbers for the management dashboard. */
export const dataImportExportKpis = (db: Database) => recordKpis(dataImportExportModule, dataImportExportTables, db, "Data jobs");
