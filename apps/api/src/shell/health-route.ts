/**
 * `GET /health`: is the API up, which release is running, and can it reach
 * the database? Used by uptime checks and the console's module health page.
 */

import { sql } from "drizzle-orm";
import { Hono } from "hono";
import type { ApiEnv } from "./api-env";
import { readConfig } from "./env";

export const healthRoute = new Hono<ApiEnv>().get("/", async (c) => {
  const config = readConfig(c.env);
  const started = Date.now();
  let database: "ok" | "down" = "ok";
  try {
    await c.var.db.execute(sql`select 1`);
  } catch {
    database = "down";
  }
  c.header("cache-control", "no-store");
  return c.json(
    { status: database === "ok" ? "ok" : "degraded", release: config.release, environment: config.environment, database, databaseMs: Date.now() - started, time: new Date().toISOString() },
    database === "ok" ? 200 : 503,
  );
});
