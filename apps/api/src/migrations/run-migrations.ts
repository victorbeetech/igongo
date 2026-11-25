/**
 * Applies the bundled module migrations that the database does not have yet.
 *
 * - Applied migrations are recorded in `public.igongo_migrations`.
 * - One migration = one transaction: it applies fully or not at all.
 * - An advisory lock makes two runs at once safe (the second waits, then
 *   finds nothing to do).
 * - An applied migration whose file has since changed is reported, never
 *   re-run: fix it with a new migration instead.
 *
 * It runs from the Worker's scheduled handler. The deploy steps turn on a
 * one-minute cron, check the table, then turn the cron off again, so the
 * database is not woken up all day (Neon bills compute time).
 */

import { sql } from "drizzle-orm";
import type { Database } from "@igongo/core";
import type { Migration } from "./migration";

/** What a run did. */
export interface MigrationReport {
  applied: string[];
  changedAfterApply: string[];
}

export async function runMigrations(db: Database, migrations: Migration[]): Promise<MigrationReport> {
  await db.execute(sql`create table if not exists public.igongo_migrations (
    module text not null, name text not null, checksum text not null,
    applied_at timestamptz not null default now(), primary key (module, name))`);
  return db.transaction(async (tx) => {
    // Hold the lock for the whole run.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('igongo_migrations'))`);
    const done = new Map((rowsOf(await tx.execute(sql`select module, name, checksum from public.igongo_migrations`))).map((r) => [`${r["module"]}/${r["name"]}`, String(r["checksum"])]));
    const report: MigrationReport = { applied: [], changedAfterApply: [] };
    for (const m of migrations) {
      const id = `${m.module}/${m.name}`;
      const checksum = done.get(id);
      if (checksum !== undefined) {
        if (checksum !== m.checksum) report.changedAfterApply.push(id);
        continue;
      }
      // Each statement in order; any failure rolls the whole run back.
      for (const statement of m.sql.split("--> statement-breakpoint")) {
        if (statement.trim()) await tx.execute(sql.raw(statement));
      }
      await tx.execute(sql`insert into public.igongo_migrations (module, name, checksum) values (${m.module}, ${m.name}, ${m.checksum})`);
      report.applied.push(id);
    }
    return report;
  });
}

/** Rows from `execute`, which differ by driver (postgres.js: array; PGlite: `{ rows }`). */
function rowsOf(result: unknown): Record<string, unknown>[] {
  return (Array.isArray(result) ? result : (result as { rows?: Record<string, unknown>[] }).rows) ?? [];
}
