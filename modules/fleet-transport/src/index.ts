/**
 * Fleet and transport (module 47) of the Igongo API. The gateway imports only
 * this file. See modules/fleet-transport/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { fleetTransportModule } from "./domain/fleet-transport-module";
import { fleetTransportTables } from "./infrastructure/db/schema";

export { fleetTransportModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const fleetTransportDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(fleetTransportModule, fleetTransportTables, db, change, staff);

/** The routes, mounted at `/api/fleet`. */
export const fleetTransportRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(fleetTransportModule.key, deps);

/** This module's numbers for the management dashboard. */
export const fleetTransportKpis = (db: Database) => recordKpis(fleetTransportModule, fleetTransportTables, db, "Fleet and transport");
