/**
 * Alerts inbox tests: each guest sees only their own items, pages go newest
 * first, marking is limited to the owner, and the badge counts unread items.
 */

import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { recordInboxItems } from "../src/application/use-cases/record-inbox-items";
import { MemoryAudienceDirectory } from "../src/infrastructure/memory/memory-audience-directory";
import { MemoryDeviceTokenRepository } from "../src/infrastructure/memory/memory-device-token-repository";
import { MemoryInboxRepository } from "../src/infrastructure/memory/memory-inbox-repository";
import { MockPushSender } from "../src/infrastructure/memory/mock-push-sender";
import { notificationsRouter } from "../src/presentation/notifications-router";
import type { NotificationsVariables, RequestActor } from "../src/presentation/request-actor";

/** A gateway stand-in that signs in [actor] and mounts the module over one shared inbox. */
function api(inbox: MemoryInboxRepository, actor?: RequestActor, now = new Date("2026-11-27T10:00:00Z")) {
  let counter = 0;
  const deps = {
    repo: new MemoryDeviceTokenRepository(),
    sender: new MockPushSender(),
    directory: new MemoryAudienceDirectory(),
    inbox,
    now: () => now,
    newId: () => `ntf_${++counter}`,
  };
  const app = new Hono<{ Variables: NotificationsVariables }>();
  app.use(async (c, next) => {
    c.set("actor", actor);
    await next();
  });
  app.route("/notifications", notificationsRouter(() => deps));
  return (method: string, path: string) => app.request(`/notifications${path}`, { method });
}

/** Writes one item for each of [people] at [when], through the real use case. */
async function notify(inbox: MemoryInboxRepository, people: string[], title: string, when: string) {
  await recordInboxItems({ inbox, now: () => new Date(when), newId: () => `ntf_${title}_${people.join("")}` }, people, {
    title,
    body: `${title} body`,
    channel: "general",
    link: "/orders/ord_1",
  });
}

const ann: RequestActor = { userId: "ann", isStaff: false, permissions: [] };

/** The only item in [inbox] (the tests write exactly one). Throws when there is none, so a test fails clearly. */
function firstItem(inbox: MemoryInboxRepository) {
  const [row] = inbox.rows.values();
  if (!row) throw new Error("the test expected one inbox item");
  return row;
}

describe("inbox: who sees what", () => {
  it("needs a signed-in caller", async () => {
    expect((await api(new MemoryInboxRepository())("GET", "/inbox")).status).toBe(401);
  });

  it("lists only the caller's own items, with the badge count", async () => {
    const inbox = new MemoryInboxRepository();
    await notify(inbox, ["ann"], "Order ready", "2026-11-27T09:00:00Z");
    await notify(inbox, ["bob"], "Bob's order", "2026-11-27T09:30:00Z");
    const body = await (await api(inbox, ann)("GET", "/inbox")).json();
    expect(body.items.map((i: { title: string }) => i.title)).toEqual(["Order ready"]);
    expect(body.unreadCount).toBe(1);
    expect(body.nextBefore).toBeNull();
  });

  it("does not let a guest open or mark another guest's item", async () => {
    const inbox = new MemoryInboxRepository();
    await notify(inbox, ["bob"], "Bob's order", "2026-11-27T09:30:00Z");
    const bobItem = firstItem(inbox);
    const annCall = api(inbox, ann);
    expect((await annCall("POST", `/inbox/${bobItem.id}/read`)).status).toBe(404);
    expect(inbox.rows.get(bobItem.id)?.readAt).toBeNull();
    expect(await (await annCall("POST", "/inbox/read-all")).json()).toEqual({ marked: 0 });
    expect(inbox.rows.get(bobItem.id)?.readAt).toBeNull();
  });
});

describe("inbox: reading and marking", () => {
  it("marks one of the caller's items read and keeps the first read time", async () => {
    const inbox = new MemoryInboxRepository();
    await notify(inbox, ["ann"], "Order ready", "2026-11-27T09:00:00Z");
    const id = firstItem(inbox).id;
    expect((await api(inbox, ann)("POST", `/inbox/${id}/read`)).status).toBe(204);
    const first = inbox.rows.get(id)?.readAt;
    expect(first?.toISOString()).toBe("2026-11-27T10:00:00.000Z");
    // Marking again does not move the read time.
    await api(inbox, ann, new Date("2026-11-27T11:00:00Z"))("POST", `/inbox/${id}/read`);
    expect(inbox.rows.get(id)?.readAt).toEqual(first);
  });

  it("marks all unread items read and reports how many", async () => {
    const inbox = new MemoryInboxRepository();
    await notify(inbox, ["ann"], "One", "2026-11-27T09:00:00Z");
    await notify(inbox, ["ann"], "Two", "2026-11-27T09:10:00Z");
    expect(await (await api(inbox, ann)("POST", "/inbox/read-all")).json()).toEqual({ marked: 2 });
    const body = await (await api(inbox, ann)("GET", "/inbox")).json();
    expect(body.unreadCount).toBe(0);
  });

  it("pages newest first with a cursor and no repeats", async () => {
    const inbox = new MemoryInboxRepository();
    await notify(inbox, ["ann"], "Old", "2026-11-27T08:00:00Z");
    await notify(inbox, ["ann"], "Middle", "2026-11-27T09:00:00Z");
    await notify(inbox, ["ann"], "New", "2026-11-27T10:00:00Z");
    const call = api(inbox, ann);
    const first = await (await call("GET", "/inbox?limit=2")).json();
    expect(first.items.map((i: { title: string }) => i.title)).toEqual(["New", "Middle"]);
    expect(first.nextBefore).not.toBeNull();
    const second = await (await call("GET", `/inbox?limit=2&before=${encodeURIComponent(first.nextBefore)}`)).json();
    expect(second.items.map((i: { title: string }) => i.title)).toEqual(["Old"]);
    expect(second.nextBefore).toBeNull();
  });

  it("refuses a bad page size or cursor", async () => {
    const call = api(new MemoryInboxRepository(), ann);
    expect((await call("GET", "/inbox?limit=0")).status).toBe(400);
    expect((await call("GET", "/inbox?limit=51")).status).toBe(400);
    expect((await call("GET", "/inbox?before=yesterday")).status).toBe(400);
  });
});

describe("recordInboxItems", () => {
  it("keeps one item per person, counting a repeated person once", async () => {
    const inbox = new MemoryInboxRepository();
    await recordInboxItems({ inbox, now: () => new Date("2026-11-27T09:00:00Z"), newId: () => `ntf_${Math.random()}` }, ["ann", "ann", "bob"], {
      title: "Hi",
      body: "Hello",
      channel: "messages",
    });
    const owners = [...inbox.rows.values()].map((i) => i.userId).sort();
    expect(owners).toEqual(["ann", "bob"]);
    expect([...inbox.rows.values()][0]?.link).toBeNull();
  });
});
