/** Test helper: a fresh in-memory Postgres (PGlite) with this module's migrations. */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

/** Runs every migration in order and returns the raw client and Drizzle. */
export async function freshDb() {
  const client = new PGlite();
  const dir = join(import.meta.dirname, "..", "migrations");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    for (const statement of readFileSync(join(dir, file), "utf8").split("--> statement-breakpoint")) {
      await client.exec(statement);
    }
  }
  return { client, db: drizzle(client) };
}
