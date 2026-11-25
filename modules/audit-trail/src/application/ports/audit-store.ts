/** Where Audit Trail entries are stored. Postgres in production. */

import type { AuditEntryInput } from "@igongo/contracts/audit-trail";
import type { AuditEntry } from "../../domain/audit-entry";
import type { AuditPage, AuditSearch } from "../../domain/audit-search";
import type { ChainCheck } from "../../domain/chain-check";

export interface AuditStore {
  /** Appends one entry; the store fills in the chain fields. */
  append(entry: AuditEntryInput & { id: string }): Promise<void>;
  /** Finds entries, newest first. */
  search(query: AuditSearch): Promise<AuditPage<AuditEntry>>;
  /** Recomputes every hash from [fromSeq], up to [limit] rows. */
  verify(fromSeq: number, limit: number): Promise<ChainCheck>;
}
