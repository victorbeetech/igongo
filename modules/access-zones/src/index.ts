/**
 * Access zones (module 19) of the Igongo API. The gateway imports only
 * this file. See modules/access-zones/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { accessZonesModule } from "./domain/access-zones-module";
import { accessZonesTables } from "./infrastructure/db/schema";

export { accessZonesModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const accessZonesDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(accessZonesModule, accessZonesTables, db, change, staff);

/** The routes, mounted at `/api/zones`. */
export const accessZonesRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(accessZonesModule.key, deps);

/** This module's numbers for the management dashboard. */
export const accessZonesKpis = (db: Database) => recordKpis(accessZonesModule, accessZonesTables, db, "Access zones");
