/**
 * Company calendar (module 53) of the Igongo API. The gateway imports only
 * this file. See modules/company-calendar/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { companyCalendarModule } from "./domain/company-calendar-module";
import { companyCalendarTables } from "./infrastructure/db/schema";

export { companyCalendarModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const companyCalendarDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(companyCalendarModule, companyCalendarTables, db, change, staff);

/** The routes, mounted at `/api/calendar`. */
export const companyCalendarRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(companyCalendarModule.key, deps);

/** This module's numbers for the management dashboard. */
export const companyCalendarKpis = (db: Database) => recordKpis(companyCalendarModule, companyCalendarTables, db, "Company calendar");
