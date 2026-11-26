/**
 * Tasks (module 42) of the Igongo API. The gateway imports only
 * this file. See modules/tasks/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { tasksModule } from "./domain/tasks-module";
import { tasksTables } from "./infrastructure/db/schema";

export { tasksModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const tasksDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(tasksModule, tasksTables, db, change, staff);

/** The routes, mounted at `/api/tasks`. */
export const tasksRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(tasksModule.key, deps);

/** This module's numbers for the management dashboard. */
export const tasksKpis = (db: Database) => recordKpis(tasksModule, tasksTables, db, "Tasks");
