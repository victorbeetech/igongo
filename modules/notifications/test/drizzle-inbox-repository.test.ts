/**
 * Runs the committed SQL migrations on a real Postgres (PGlite, in memory)
 * and tests the Drizzle inbox repository on it, so the migration and the code agree.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { beforeEach, describe, expect, it } from "vitest";
import { DrizzleInboxRepository } from "../src/infrastructure/db/drizzle-inbox-repository";
import type { InboxItem } from "../src/domain/inbox-item";

const migrations = join(import.meta.dirname, "..", "migrations");

/** A fresh database with every migration applied, in order. */
async function freshRepository() {
  const client = new PGlite();
  for (const file of readdirSync(migrations).filter((f) => f.endsWith(".sql")).sort()) {
    for (const statement of readFileSync(join(migrations, file), "utf8").split("--> statement-breakpoint")) {
      await client.exec(statement);
    }
  }
  return new DrizzleInboxRepository(drizzle(client));
}

/** One unread item for [userId] created at [createdAt]. */
function item(id: string, userId: string, createdAt: string): InboxItem {
  return { id, userId, title: `Title ${id}`, body: "Body", channel: "general", link: "/orders/1", createdAt: new Date(createdAt), readAt: null };
}

describe("DrizzleInboxRepository", () => {
  let repo: DrizzleInboxRepository;
  const now = new Date("2026-11-27T12:00:00Z");
  beforeEach(async () => {
    repo = await freshRepository();
  });

  it("stores items and returns them newest first, only for their owner", async () => {
    await repo.add(item("ntf_1", "ann", "2026-11-27T09:00:00Z"));
    await repo.add(item("ntf_2", "ann", "2026-11-27T10:00:00Z"));
    await repo.add(item("ntf_3", "bob", "2026-11-27T11:00:00Z"));
    const rows = await repo.listForUser("ann", 10);
    expect(rows.map((r) => r.id)).toEqual(["ntf_2", "ntf_1"]);
    expect(rows[0]).toMatchObject({ channel: "general", link: "/orders/1", readAt: null });
  });

  it("pages by time, strictly older than the cursor", async () => {
    await repo.add(item("ntf_1", "ann", "2026-11-27T09:00:00Z"));
    await repo.add(item("ntf_2", "ann", "2026-11-27T10:00:00Z"));
    const rows = await repo.listForUser("ann", 10, new Date("2026-11-27T10:00:00Z"));
    expect(rows.map((r) => r.id)).toEqual(["ntf_1"]);
  });

  it("counts unread items and marks only the owner's items read", async () => {
    await repo.add(item("ntf_1", "ann", "2026-11-27T09:00:00Z"));
    await repo.add(item("ntf_2", "bob", "2026-11-27T09:00:00Z"));
    expect(await repo.unreadCount("ann")).toBe(1);
    expect(await repo.markRead("bob", "ntf_1", now)).toBe(false);
    expect(await repo.markRead("ann", "ntf_1", now)).toBe(true);
    expect(await repo.unreadCount("ann")).toBe(0);
    expect(await repo.unreadCount("bob")).toBe(1);
  });

  it("keeps the first read time when marked again", async () => {
    await repo.add(item("ntf_1", "ann", "2026-11-27T09:00:00Z"));
    await repo.markRead("ann", "ntf_1", now);
    await repo.markRead("ann", "ntf_1", new Date("2026-11-27T13:00:00Z"));
    const [row] = await repo.listForUser("ann", 1);
    expect(row?.readAt?.toISOString()).toBe(now.toISOString());
  });

  it("marks all of the owner's unread items and reports the count", async () => {
    await repo.add(item("ntf_1", "ann", "2026-11-27T09:00:00Z"));
    await repo.add(item("ntf_2", "ann", "2026-11-27T09:30:00Z"));
    await repo.add(item("ntf_3", "bob", "2026-11-27T09:30:00Z"));
    expect(await repo.markAllRead("ann", now)).toBe(2);
    expect(await repo.markAllRead("ann", now)).toBe(0);
    expect(await repo.unreadCount("bob")).toBe(1);
  });
});
