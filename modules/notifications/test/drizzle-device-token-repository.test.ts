/**
 * Runs the committed SQL migration on a real Postgres (PGlite, in memory) and
 * tests the Drizzle repository on it, so the migration and the code agree.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import { DrizzleDeviceTokenRepository } from "../src/infrastructure/db/drizzle-device-token-repository";

const migrations = join(import.meta.dirname, "..", "migrations");

/** A fresh database with every migration applied, in order. */
async function freshRepository() {
  const client = new PGlite();
  for (const file of readdirSync(migrations).filter((f) => f.endsWith(".sql")).sort()) {
    for (const statement of readFileSync(join(migrations, file), "utf8").split("--> statement-breakpoint")) {
      await client.exec(statement);
    }
  }
  return new DrizzleDeviceTokenRepository(drizzle(client));
}

describe("DrizzleDeviceTokenRepository", () => {
  let repo: DrizzleDeviceTokenRepository;
  const now = new Date("2026-11-25T10:00:00Z");
  beforeEach(async () => {
    repo = await freshRepository();
  });

  it("saves, refreshes and moves a token to the new person", async () => {
    await repo.upsert({ token: "t1", userId: "ann", platform: "android", now });
    await repo.upsert({ token: "t1", userId: "bob", platform: "android", now: new Date("2026-11-26T10:00:00Z") });
    expect(await repo.findByUsers(["ann"])).toEqual([]);
    const [row] = await repo.findByUsers(["bob"]);
    expect(row).toMatchObject({ token: "t1", userId: "bob", createdAt: now });
    expect(row?.lastSeenAt.toISOString()).toBe("2026-11-26T10:00:00.000Z");
  });

  it("removes a token only for its owner, and many at once", async () => {
    await repo.upsert({ token: "t1", userId: "ann", platform: "ios", now });
    await repo.upsert({ token: "t2", userId: "ann", platform: "ios", now });
    expect(await repo.removeForUser("t1", "bob")).toBe(false);
    expect(await repo.removeForUser("t1", "ann")).toBe(true);
    await repo.removeMany(["t2", "missing"]);
    expect(await repo.findByUsers(["ann"])).toEqual([]);
  });
});
