/**
 * The database type every module repository takes: any Drizzle Postgres
 * database. In production it is Neon through Hyperdrive (postgres.js); in
 * tests it is PGlite, a real Postgres in memory.
 */

import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

/** Any Drizzle Postgres database. */
export type Database = PgDatabase<PgQueryResultHKT>;
