/**
 * Devices (module 18) of the Igongo API. The gateway imports only
 * this file. See modules/devices-stations/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { devicesStationsModule } from "./domain/devices-stations-module";
import { devicesStationsTables } from "./infrastructure/db/schema";

export { devicesStationsModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const devicesStationsDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(devicesStationsModule, devicesStationsTables, db, change, staff);

/** The routes, mounted at `/api/devices`. */
export const devicesStationsRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(devicesStationsModule.key, deps);

/** This module's numbers for the management dashboard. */
export const devicesStationsKpis = (db: Database) => recordKpis(devicesStationsModule, devicesStationsTables, db, "Devices");
