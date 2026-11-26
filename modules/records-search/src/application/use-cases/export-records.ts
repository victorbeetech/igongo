/**
 * Use case: export what a search finds as CSV (S06-04), page by page up to
 * [max] rows, and record who took it (exports are themselves a record).
 */

import type { AuditQuery } from "@igongo/contracts/audit-trail";
import { recordChange, toCsv, type CsvCell } from "@igongo/core";
import type { RecordsDeps } from "../records-deps";

export async function exportRecords(deps: RecordsDeps, query: Omit<AuditQuery, "limit" | "beforeSeq">, max = 5000): Promise<{ csv: string; rows: number }> {
  const rows: CsvCell[][] = [["When", "Who", "Module", "Action", "Record", "What happened"]];
  let beforeSeq: number | undefined;
  // Pages of 200, newest first, until the end or [max].
  while (rows.length - 1 < max) {
    const page = await deps.trail.search({ ...query, limit: 200, ...(beforeSeq ? { beforeSeq } : {}) });
    rows.push(...page.items.map((e) => [e.occurredAt, e.actorName ?? e.actorId ?? "System", e.module, e.action, e.recordType ? `${e.recordType} ${e.recordId ?? ""}`.trim() : "", e.summary]));
    if (!page.nextBeforeSeq) break;
    beforeSeq = page.nextBeforeSeq;
  }
  const count = Math.min(rows.length - 1, max);
  await recordChange(deps.change, { module: "records-search", action: "records.exported", recordType: "search", recordId: query.text ?? query.module ?? "all", summary: `Exported ${count} records${query.text ? ` matching "${query.text}"` : ""}` });
  return { csv: toCsv(rows.slice(0, max + 1)), rows: count };
}
