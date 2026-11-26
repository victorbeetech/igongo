/**
 * Onboarding and exit (module 24) of the Igongo API. The gateway imports only
 * this file. See modules/onboarding-exit/README.md.
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext, Database } from "@igongo/core";
import { recordKpis, recordsDeps, recordsRouter, type RecordsDeps } from "@igongo/records-kit";
import { onboardingExitModule } from "./domain/onboarding-exit-module";
import { onboardingExitTables } from "./infrastructure/db/schema";

export { onboardingExitModule };

/** This module's dependencies for one request. [staff] is null while HR Records is off. */
export const onboardingExitDeps = (db: Database, change: ChangeContext, staff: StaffDirectory | null): RecordsDeps => recordsDeps(onboardingExitModule, onboardingExitTables, db, change, staff);

/** The routes, mounted at `/api/onboarding`. */
export const onboardingExitRouter = (deps: Parameters<typeof recordsRouter>[1]) => recordsRouter(onboardingExitModule.key, deps);

/** This module's numbers for the management dashboard. */
export const onboardingExitKpis = (db: Database) => recordKpis(onboardingExitModule, onboardingExitTables, db, "Onboarding and exit");
