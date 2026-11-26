/**
 * Records Archive & Search (module 06) of the Igongo API: "who did what,
 * when", years back, over the Audit Trail. The gateway imports only this file.
 */

export type { RecordsDeps } from "./application/records-deps";
export { exportRecords } from "./application/use-cases/export-records";
export { RECORDS_PERMISSIONS } from "./presentation/permissions";
export { recordsRouter } from "./presentation/records-router";
