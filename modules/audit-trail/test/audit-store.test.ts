/**
 * Runs the real migrations on PGlite and checks the Audit Trail promises:
 * entries chain by hash, can't be changed or deleted, tampering is found,
 * secrets are masked and search works.
 */

import { describe, expect, it } from "vitest";
import { auditRecorder, DrizzleAuditStore, searchEntries, verifyChain } from "../src";
import { freshDb } from "./helpers";

/** A store with three entries recorded. */
async function seeded() {
  const { client, db } = await freshDb();
  const store = new DrizzleAuditStore(db);
  const audit = auditRecorder(store);
  await audit.record({ actorId: "u1", actorName: "Ann Mugisha", action: "role.created", module: "roles-permissions", recordType: "role", recordId: "r1", summary: "Created the role Chef" });
  await audit.record({ actorId: "u2", action: "settings.changed", module: "super-admin", summary: "Changed the Google key", changes: { clientSecret: { old: null, new: "abc" }, name: { old: "A", new: "B" } } });
  await audit.record({ actorId: "u1", action: "login.succeeded", module: "users-login", summary: "Signed in with Google" });
  return { client, store };
}

describe("Audit Trail store", () => {
  it("chains each entry to the one before and verifies intact", async () => {
    const { store } = await seeded();
    const { items } = await searchEntries(store, { limit: 10 });
    expect(items.map((e) => e.seq)).toEqual([3, 2, 1]);
    expect(items[2]?.prevHash).toBe("0".repeat(64));
    expect(items[1]?.prevHash).toBe(items[2]?.hash);
    expect(await verifyChain(store)).toEqual({ intact: true, checked: 3, brokenAtSeq: null });
  });

  it("refuses updates, deletes and truncation", async () => {
    const { client } = await seeded();
    await expect(client.exec("update audit.events set summary = 'x'")).rejects.toThrow(/append-only/);
    await expect(client.exec("delete from audit.events")).rejects.toThrow(/append-only/);
    await expect(client.exec("truncate audit.events")).rejects.toThrow(/append-only/);
  });

  it("finds tampering done around the triggers", async () => {
    const { client, store } = await seeded();
    // Simulate an attacker with superuser rights who disables the trigger.
    await client.exec("alter table audit.events disable trigger events_no_update_delete; update audit.events set summary = 'Nothing happened' where seq = 2;");
    expect(await verifyChain(store)).toMatchObject({ intact: false, brokenAtSeq: 2 });
  });

  it("masks secret fields and searches by person, record and words", async () => {
    const { store } = await seeded();
    const changed = await searchEntries(store, { module: "super-admin", limit: 5 });
    expect(changed.items[0]?.changes).toEqual({ clientSecret: { old: null, new: "••••" }, name: { old: "A", new: "B" } });
    expect((await searchEntries(store, { actorId: "u1", limit: 5 })).items).toHaveLength(2);
    expect((await searchEntries(store, { recordType: "role", recordId: "r1", limit: 5 })).items).toHaveLength(1);
    expect((await searchEntries(store, { text: "chef", limit: 5 })).items[0]?.recordId).toBe("r1");
    const page = await searchEntries(store, { limit: 2 });
    expect(page.nextBeforeSeq).toBe(2);
    expect((await searchEntries(store, { limit: 2, beforeSeq: 2 })).items.map((e) => e.seq)).toEqual([1]);
  });

  it("refuses an entry without an action", async () => {
    const { store } = await seeded();
    await expect(auditRecorder(store).record({ actorId: null, action: "", module: "x", summary: "y" })).rejects.toThrow();
  });
});
