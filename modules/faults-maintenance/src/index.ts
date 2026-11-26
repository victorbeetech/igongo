/**
 * Faults & Maintenance (module 40) of the Igongo API. The gateway imports
 * only this file. See modules/faults-maintenance/README.md.
 */

export type { FaultsDeps } from "./application/faults-deps";
export { DEFAULT_FAULT_SETTINGS, type FaultSettings } from "./domain/fault-settings";
export { canMove, FAULT_STATUSES, type FaultStatus } from "./domain/fault-status";
export type { Fault } from "./domain/fault";
export { DrizzleFaultRepository } from "./infrastructure/db/drizzle-fault-repository";
export { SettingsFaultStore } from "./infrastructure/db/settings-fault-store";
export { faultKpis } from "./infrastructure/fault-kpis";
export { faultReporter } from "./infrastructure/fault-reporter";
export { FAULT_PERMISSIONS } from "./presentation/permissions";
export { faultsRouter } from "./presentation/faults-router";
