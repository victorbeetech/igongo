/** One recorded action, as read back from the Audit Trail. */

import type { AuditEntryInput } from "@igongo/contracts/audit-trail";

/** A stored entry: what was sent, plus its place in the hash chain. */
export interface AuditEntry extends AuditEntryInput {
  seq: number;
  id: string;
  occurredAt: Date;
  prevHash: string;
  hash: string;
}
