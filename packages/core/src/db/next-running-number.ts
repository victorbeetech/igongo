/**
 * The next running number for a record, such as `FLT-0042` or `ADV-0007`:
 * the largest number in [column] plus one, with [prefix] and zero padding.
 * Shared by every module that numbers its records, so they all look alike.
 */

import { sql, type AnyColumn } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { Database } from "./database";

export async function nextRunningNumber(db: Database, table: PgTable, column: AnyColumn, prefix: string, digits = 4): Promise<string> {
  // Numbers end in digits; take the largest running part.
  const [row] = await db.select({ max: sql<number>`coalesce(max(substring(${column} from '[0-9]+$')::int), 0)` }).from(table);
  return `${prefix}-${String(Number(row?.max ?? 0) + 1).padStart(digits, "0")}`;
}
