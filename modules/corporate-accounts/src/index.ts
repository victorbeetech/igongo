/**
 * Corporate accounts (module 55) of the Igongo API. The gateway imports only
 * this file. See modules/corporate-accounts/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { corporateAccountsModule } from "./domain/corporate-accounts-module";
import { corporateAccountsTables } from "./infrastructure/db/schema";

export { corporateAccountsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const corporateAccountsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(corporateAccountsModule, corporateAccountsTables, db, change, staff);

/** The routes, mounted at `/api/corporate`. */
export const corporateAccountsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(corporateAccountsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const corporateAccountsKpis = (db: Database) => recordKpis(corporateAccountsModule, corporateAccountsTables, db, "Corporate accounts");
