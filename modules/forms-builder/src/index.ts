/**
 * Forms (module 8) of the Igongo API. The gateway imports only
 * this file. See modules/forms-builder/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { formsBuilderModule } from "./domain/forms-builder-module";
import { formsBuilderTables } from "./infrastructure/db/schema";

export { formsBuilderModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const formsBuilderDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(formsBuilderModule, formsBuilderTables, db, change, staff);

/** The routes, mounted at `/api/forms`. */
export const formsBuilderRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(formsBuilderModule.key, deps);

/** This module's numbers for the management dashboard. */
export const formsBuilderKpis = (db: Database) => recordKpis(formsBuilderModule, formsBuilderTables, db, "Forms");
