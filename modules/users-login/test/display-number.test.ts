/**
 * The short profile number: formatting, and that the database hands out
 * numbers in order and backfills existing accounts in creation order.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { describe, expect, it } from "vitest";
import { formatDisplayNumber } from "../src/domain/display-number";
import { DrizzleAccountStore } from "../src/infrastructure/db/drizzle-account-store";
import { user } from "../src/infrastructure/db/schema";
import { freshDb } from "./helpers";

const migrationsDir = join(import.meta.dirname, "..", "migrations");

/** Runs one migration file's statements, the way the test helper does. */
async function runMigration(client: PGlite, file: string) {
  for (const statement of readFileSync(join(migrationsDir, file), "utf8").split("--> statement-breakpoint")) {
    await client.exec(statement);
  }
}

describe("formatDisplayNumber", () => {
  it("pads to five digits and never produces anything but digits", () => {
    expect(formatDisplayNumber(1)).toBe("00001");
    expect(formatDisplayNumber(42)).toBe("00042");
    expect(formatDisplayNumber(99999)).toBe("99999");
  });

  it("keeps growing past five digits, up to a million people and beyond", () => {
    expect(formatDisplayNumber(100000)).toBe("100000");
    expect(formatDisplayNumber(1000000)).toBe("1000000");
    expect(formatDisplayNumber(1000000)).toMatch(/^\d+$/);
  });

  it("refuses zero, negatives and non-whole numbers", () => {
    for (const bad of [0, -1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 2]) {
      expect(() => formatDisplayNumber(bad)).toThrow(RangeError);
    }
  });
});

describe("assigning display numbers", () => {
  it("gives each new account the next number, in order", async () => {
    const { db } = await freshDb();
    await db.insert(user).values({ id: "a", name: "Ann", email: "ann@example.com" });
    await db.insert(user).values({ id: "b", name: "Ben", email: "ben@example.com" });
    const rows = await db.select({ id: user.id, n: user.displayNumber }).from(user);
    expect(Object.fromEntries(rows.map((r) => [r.id, r.n]))).toEqual({ a: 1, b: 2 });
  });

  it("shows the padded number on the account summary", async () => {
    const { db } = await freshDb();
    await db.insert(user).values({ id: "c", name: "Cy", email: "cy@example.com" });
    const store = new DrizzleAccountStore(db);
    expect((await store.get("c"))?.displayId).toBe("00001");
  });

  it("backfills existing accounts in creation order, then continues the count", async () => {
    // Migrate to the state before this change, with accounts created out of ID order.
    const client = new PGlite();
    await runMigration(client, "0000_users_login.sql");
    await runMigration(client, "0001_security.sql");
    await client.exec(`INSERT INTO users_login."user" (id, name, email, created_at) VALUES
      ('zed', 'Zed', 'zed@example.com', '2026-01-03'),
      ('amy', 'Amy', 'amy@example.com', '2026-01-01'),
      ('bob', 'Bob', 'bob@example.com', '2026-01-02')`);

    await runMigration(client, "0002_display_number.sql");
    const db = drizzle(client);
    const before = await db.select({ id: user.id, n: user.displayNumber }).from(user);
    expect(Object.fromEntries(before.map((r) => [r.id, r.n]))).toEqual({ amy: 1, bob: 2, zed: 3 });

    // A new account after the backfill takes the next number, not a repeat.
    await db.insert(user).values({ id: "new", name: "New", email: "new@example.com" });
    const [added] = await db.select({ n: user.displayNumber }).from(user).where(eq(user.id, "new"));
    expect(added?.n).toBe(4);
    await client.close();
  });
});
