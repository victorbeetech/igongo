/**
 * Use case: search the Audit Trail ("who did X two years ago"), or show one
 * record's timeline when `recordType` and `recordId` are given.
 */

import type { AuditEntry } from "../../domain/audit-entry";
import type { AuditPage, AuditSearch } from "../../domain/audit-search";
import type { AuditStore } from "../ports/audit-store";

/** Runs the search, keeping the page size between 1 and 200. */
export function searchEntries(store: AuditStore, query: AuditSearch): Promise<AuditPage<AuditEntry>> {
  return store.search({ ...query, limit: Math.min(Math.max(query.limit, 1), 200) });
}
