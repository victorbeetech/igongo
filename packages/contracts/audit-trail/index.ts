/**
 * Public contract of the Audit Trail module (module 5). Other modules record
 * what they did through `AuditRecorder`; they never touch the `audit` tables.
 */

/** One changed field: its value before and after. */
export interface FieldChange {
  old: unknown;
  new: unknown;
}

/** Where an action came from. Every field is optional. */
export interface AuditContext {
  requestId?: string;
  ip?: string;
  userAgent?: string;
  deviceId?: string;
  stationId?: string;
  appVersion?: string;
}

/** What a module sends to record one action. */
export interface AuditEntryInput {
  /** The person who did it, or null for the system itself. */
  actorId: string | null;
  /** Their name at the time, so the record reads well years later. */
  actorName?: string;
  /** The role they acted under, when one applies. */
  actorRole?: string;
  /** What happened, such as `role.created`, `login.failed` or `settings.changed`. */
  action: string;
  /** The module key, such as `roles-permissions`. */
  module: string;
  /** The kind of record, such as `role`, and its ID. */
  recordType?: string;
  recordId?: string;
  /** One readable sentence, such as "Created the role Chef". */
  summary: string;
  /** Old and new values of each changed field. Never put secrets here. */
  changes?: Record<string, FieldChange>;
  context?: AuditContext;
}

/** Records actions. If recording fails, the caller must refuse the action. */
export interface AuditRecorder {
  record(entry: AuditEntryInput): Promise<void>;
}

/** Events this module emits. */
export const AUDIT_EVENTS = {
  alertRaised: "audit.alert_raised",
  exported: "audit.exported",
} as const;
