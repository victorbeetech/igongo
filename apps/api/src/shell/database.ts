/**
 * Opens the database for one request. In production that is Neon through
 * Hyperdrive with postgres.js (Hyperdrive pools the real connections, so a
 * new client per request is cheap). Tests pass their own provider (PGlite).
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { AppError, type Database } from "@igongo/core";
import { readConfig, type Env } from "./env";

/** A database for one request, and how to close it afterwards. */
export interface OpenDatabase {
  db: Database;
  close: () => Promise<void>;
}

/** Opens a database for a request. */
export type DatabaseProvider = (env: Env) => OpenDatabase;

/** The production provider. */
export const postgresProvider: DatabaseProvider = (env) => {
  const url = readConfig(env).databaseUrl;
  if (!url) throw new AppError("not_configured", "The database is not connected.");
  // Hyperdrive caches prepared statements; type fetching is not needed.
  const client = postgres(url, { max: 5, fetch_types: false });
  return { db: drizzle(client) as unknown as Database, close: () => client.end({ timeout: 5 }) };
};
