/**
 * The broadcast route checks the permission the way every module does: a
 * wildcard grant (such as notifications.*.*) allows it, and a person with no
 * grant gets 403. The post itself goes through notifyPeople, so it is also
 * written to the inbox.
 */

import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { MemoryAudienceDirectory } from "../src/infrastructure/memory/memory-audience-directory";
import { MemoryDeviceTokenRepository } from "../src/infrastructure/memory/memory-device-token-repository";
import { MemoryInboxRepository } from "../src/infrastructure/memory/memory-inbox-repository";
import { MockPushSender } from "../src/infrastructure/memory/mock-push-sender";
import { notificationsRouter } from "../src/presentation/notifications-router";
import type { NotificationsVariables, RequestActor } from "../src/presentation/request-actor";

/** Mounts the router for [actor] over one shared inbox, with Ann holding the "chef" role. */
function api(actor: RequestActor) {
  const inbox = new MemoryInboxRepository();
  let counter = 0;
  const deps = {
    repo: new MemoryDeviceTokenRepository(),
    sender: new MockPushSender(),
    directory: new MemoryAudienceDirectory({ chef: ["ann"] }),
    inbox,
    now: () => new Date("2026-11-28T08:00:00Z"),
    newId: () => `ntf_${++counter}`,
  };
  const app = new Hono<{ Variables: NotificationsVariables }>();
  app.use(async (c, next) => {
    c.set("actor", actor);
    await next();
  });
  app.route("/", notificationsRouter(() => deps));
  const body = { target: { kind: "roles", roles: ["chef"] }, title: "Hello", body: "All staff", channel: "general" };
  return { app, inbox, body };
}

const boss: RequestActor = { userId: "boss", isStaff: true, permissions: ["notifications.*.*"] };
const nobody: RequestActor = { userId: "guest", isStaff: false, permissions: [] };

describe("POST /push/broadcast", () => {
  it("lets a wildcard grant post, and writes the inbox item", async () => {
    const { app, inbox, body } = api(boss);
    const res = await app.request("/push/broadcast", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    expect(res.status).toBe(200);
    expect(await inbox.unreadCount("ann")).toBe(1);
  });

  it("refuses a person without the permission, and writes nothing", async () => {
    const { app, inbox, body } = api(nobody);
    const res = await app.request("/push/broadcast", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    expect(res.status).toBe(403);
    expect(await inbox.unreadCount("ann")).toBe(0);
  });
});
