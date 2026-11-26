/**
 * Security (module 45) of the Igongo API. The gateway imports only
 * this file. See modules/security-incidents/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { securityIncidentsModule } from "./domain/security-incidents-module";
import { securityIncidentsTables } from "./infrastructure/db/schema";

export { securityIncidentsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const securityIncidentsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(securityIncidentsModule, securityIncidentsTables, db, change, staff);

/** The routes, mounted at `/api/security`. */
export const securityIncidentsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(securityIncidentsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const securityIncidentsKpis = (db: Database) => recordKpis(securityIncidentsModule, securityIncidentsTables, db, "Security");
