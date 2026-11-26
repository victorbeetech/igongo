/**
 * @igongo/records-kit: the work-records engine shared by every module whose
 * work is "a record that moves through steps": Lost & Found, Tasks, Leave,
 * Visitors, Key Control, Cash-up and many more. Each module keeps its own
 * folder, Postgres schema, default set-up and permissions; this package is
 * the code they reuse. The super admin changes each module's record types,
 * fields and statuses at runtime. See README.md.
 */

export type { Caller } from "./application/caller";
export type { RecordModule } from "./application/record-module";
export type { RecordsDeps } from "./application/records-deps";
export { FIELD_KINDS, type FieldDef, type FieldKind, type FieldValue } from "./domain/field-def";
export type { RecordConfig } from "./domain/record-config";
export type { RecordEvent } from "./domain/record-event";
export { choice, field, steps } from "./domain/builders";
export { checkMove, cleanFields, startStatus, titleFor, typeOf } from "./domain/record-rules";
export type { RecordType } from "./domain/record-type";
export type { StatusDef } from "./domain/status-def";
export type { WorkRecord } from "./domain/work-record";
export { recordTables, type RecordTables } from "./infrastructure/db/record-tables";
export { recordKpis } from "./infrastructure/record-kpis";
export { recordsDeps } from "./infrastructure/records-deps-factory";
export { recordPermissions } from "./presentation/record-permissions";
export { RECORD_QR_PREFIX, recordsRouter } from "./presentation/records-router";
