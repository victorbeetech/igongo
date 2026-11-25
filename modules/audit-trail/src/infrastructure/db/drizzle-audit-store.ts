/** `AuditStore` on Postgres (Neon through Hyperdrive), with Drizzle. */

import { and, desc, eq, gte, lt, sql, type SQL } from "drizzle-orm";
import type { AuditEntryInput } from "@igongo/contracts/audit-trail";
import type { Database } from "@igongo/core";
import type { AuditStore } from "../../application/ports/audit-store";
import type { AuditEntry } from "../../domain/audit-entry";
import type { AuditPage, AuditSearch } from "../../domain/audit-search";
import type { ChainCheck } from "../../domain/chain-check";
import { auditEvents } from "./schema";

export class DrizzleAuditStore implements AuditStore {
  constructor(private readonly db: Database) {}

  async append(entry: AuditEntryInput & { id: string }): Promise<void> {
    // The insert trigger adds seq, prev_hash and hash under a lock.
    await this.db.insert(auditEvents).values({
      id: entry.id,
      actorId: entry.actorId,
      actorName: entry.actorName ?? null,
      actorRole: entry.actorRole ?? null,
      action: entry.action,
      module: entry.module,
      recordType: entry.recordType ?? null,
      recordId: entry.recordId ?? null,
      summary: entry.summary,
      changes: entry.changes ?? null,
      context: entry.context ?? null,
    });
  }

  async search(query: AuditSearch): Promise<AuditPage<AuditEntry>> {
    // Ask for one extra row to know whether another page exists.
    const rows = await this.db
      .select()
      .from(auditEvents)
      .where(and(...filters(query)))
      .orderBy(desc(auditEvents.seq))
      .limit(query.limit + 1);
    const items = rows.slice(0, query.limit).map(toEntry);
    const last = items.at(-1);
    return { items, nextBeforeSeq: rows.length > query.limit && last ? last.seq : null };
  }

  async verify(fromSeq: number, limit: number): Promise<ChainCheck> {
    // Recompute each hash in SQL with the same function the trigger used,
    // and compare each row's prev_hash with the hash of the row before it.
    const result = await this.db.execute(sql`
      with checked as (
        select e.seq, e.hash, e.prev_hash,
               lag(e.hash) over (order by e.seq) as previous,
               encode(sha256(convert_to(audit.entry_text(e), 'UTF8')), 'hex') as recomputed
        from audit.events e
        where e.seq >= ${fromSeq} - 1
        order by e.seq
        limit ${limit} + 1
      )
      select count(*) filter (where seq >= ${fromSeq})::int as checked,
             min(seq) filter (where seq >= ${fromSeq} and (hash <> recomputed or (previous is not null and prev_hash <> previous)))::bigint as broken
      from checked`);
    const row = rowsOf(result)[0] ?? {};
    const broken = row["broken"];
    return { intact: broken == null, checked: Number(row["checked"] ?? 0), brokenAtSeq: broken == null ? null : Number(broken) };
  }
}

/** Turns the search fields into SQL conditions. */
function filters(q: AuditSearch): SQL[] {
  const where: SQL[] = [];
  if (q.actorId) where.push(eq(auditEvents.actorId, q.actorId));
  if (q.module) where.push(eq(auditEvents.module, q.module));
  if (q.action) where.push(eq(auditEvents.action, q.action));
  if (q.recordType) where.push(eq(auditEvents.recordType, q.recordType));
  if (q.recordId) where.push(eq(auditEvents.recordId, q.recordId));
  if (q.from) where.push(gte(auditEvents.occurredAt, q.from));
  if (q.to) where.push(lt(auditEvents.occurredAt, q.to));
  if (q.beforeSeq) where.push(lt(auditEvents.seq, q.beforeSeq));
  // Full-text over summary and name (the `search` column from the migration).
  if (q.text) where.push(sql`search @@ websearch_to_tsquery('simple', ${q.text})`);
  return where;
}

/** A database row as a domain entry. */
function toEntry(r: typeof auditEvents.$inferSelect): AuditEntry {
  return {
    seq: r.seq,
    id: r.id,
    occurredAt: r.occurredAt,
    actorId: r.actorId,
    ...(r.actorName ? { actorName: r.actorName } : {}),
    ...(r.actorRole ? { actorRole: r.actorRole } : {}),
    action: r.action,
    module: r.module,
    ...(r.recordType ? { recordType: r.recordType } : {}),
    ...(r.recordId ? { recordId: r.recordId } : {}),
    summary: r.summary,
    ...(r.changes ? { changes: r.changes } : {}),
    ...(r.context ? { context: r.context } : {}),
    prevHash: r.prevHash,
    hash: r.hash,
  };
}

/** Rows from `db.execute`, which differ by driver (postgres.js gives an array, PGlite `{ rows }`). */
function rowsOf(result: unknown): Record<string, unknown>[] {
  return (Array.isArray(result) ? result : (result as { rows: Record<string, unknown>[] }).rows) ?? [];
}
