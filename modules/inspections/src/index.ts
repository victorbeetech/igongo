/**
 * Inspections (module 39) of the Igongo API: HOD daily checkups. The gateway
 * imports only this file. See modules/inspections/README.md.
 */

export type { InspectionsDeps } from "./application/inspections-deps";
export { periodStart } from "./application/use-cases/period-start";
export { scoreOf, type CheckResult } from "./domain/check-result";
export type { Checklist } from "./domain/checklist";
export type { InspectionRun } from "./domain/inspection-run";
export { DrizzleInspectionRepository } from "./infrastructure/db/drizzle-inspection-repository";
export { SettingsInspectionStore } from "./infrastructure/db/settings-inspection-store";
export { inspectionKpis } from "./infrastructure/inspection-kpis";
export { INSPECTION_PERMISSIONS } from "./presentation/permissions";
export { inspectionsRouter } from "./presentation/inspections-router";
