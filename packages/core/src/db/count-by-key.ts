/**
 * How many rows of [table] point at each of [ids] through [key], such as
 * likes or comments per fault for a list. One grouped query, so lists never
 * need correlated sub-selects (whose unqualified column names can clash).
 * @example await countByKey(db, faultLikes, faultLikes.faultId, ["f1", "f2"]) // Map { "f1" => 3 }
 */

import { and, count, inArray, type SQL } from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import type { Database } from "./database";

export async function countByKey(db: Database, table: PgTable, key: PgColumn, ids: string[], also?: SQL): Promise<Map<string, number>> {
  if (ids.length === 0) return new Map();
  const rows = await db.select({ key, n: count() }).from(table).where(and(inArray(key, ids), also)).groupBy(key);
  return new Map(rows.map((r) => [String(r.key), Number(r.n)]));
}
