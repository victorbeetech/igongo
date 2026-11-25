/**
 * The Audit Trail module (module 5) of the Igongo API. The gateway imports
 * only this file. See modules/audit-trail/README.md.
 */

export { auditRecorder } from "./application/use-cases/record-entry";
export { searchEntries } from "./application/use-cases/search-entries";
export { verifyChain } from "./application/use-cases/verify-chain";
export type { AuditEntry } from "./domain/audit-entry";
export { DrizzleAuditStore } from "./infrastructure/db/drizzle-audit-store";
export { auditRouter } from "./presentation/audit-router";
export { AUDIT_PERMISSIONS } from "./presentation/permissions";
