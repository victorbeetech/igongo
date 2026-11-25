/** Route tests: the gateway's actor, validation, permissions and the use cases end to end. */

import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import { MemoryAudienceDirectory } from "../src/infrastructure/memory/memory-audience-directory";
import { MemoryDeviceTokenRepository } from "../src/infrastructure/memory/memory-device-token-repository";
import { MockPushSender } from "../src/infrastructure/memory/mock-push-sender";
import { notificationsRouter } from "../src/presentation/notifications-router";
import { PERMISSIONS, type NotificationsVariables, type RequestActor } from "../src/presentation/request-actor";

const TOKEN = "fcm-token-0123456789-abcdef";

/** A gateway stand-in that signs in [actor] and mounts the module. */
function api(actor?: RequestActor) {
  const repo = new MemoryDeviceTokenRepository();
  const sender = new MockPushSender();
  const deps = { repo, sender, directory: new MemoryAudienceDirectory(), now: () => new Date(), newId: () => "n1" };
  const app = new Hono<{ Variables: NotificationsVariables }>();
  app.use(async (c, next) => {
    c.set("actor", actor);
    await next();
  });
  app.route("/notifications", notificationsRouter(() => deps));
  const call = (method: string, path: string, body?: unknown) =>
    app.request(`/notifications${path}`, {
      method,
      headers: { "content-type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  return { call, repo, sender };
}

const staff: RequestActor = { userId: "ann", isStaff: true, permissions: [] };
const admin: RequestActor = { userId: "sa", isStaff: true, permissions: [PERMISSIONS.testPush, PERMISSIONS.broadcast] };

describe("notifications routes", () => {
  it("needs a signed-in caller", async () => {
    expect((await api().call("POST", "/devices", { token: TOKEN, platform: "android" })).status).toBe(401);
  });

  it("registers a token and answers with the topics", async () => {
    const { call, repo } = api(staff);
    const response = await call("POST", "/devices", { token: TOKEN, platform: "android" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ topics: ["all", "staff"] });
    expect(repo.rows.get(TOKEN)?.userId).toBe("ann");
  });

  it("gives clients the client topics", async () => {
    const response = await api({ ...staff, isStaff: false }).call("POST", "/devices", { token: TOKEN, platform: "ios" });
    expect(await response.json()).toEqual({ topics: ["all", "clients"] });
  });

  it("refuses a bad body", async () => {
    const { call } = api(staff);
    expect((await call("POST", "/devices", { token: "short", platform: "android" })).status).toBe(400);
    expect((await call("POST", "/devices", { token: TOKEN, platform: "nokia" })).status).toBe(400);
  });

  it("removes only the caller's own token", async () => {
    const { call, repo } = api(staff);
    await repo.upsert({ token: TOKEN, userId: "bob", platform: "android", now: new Date() });
    expect((await call("DELETE", `/devices/${TOKEN}`)).status).toBe(204);
    expect(repo.rows.has(TOKEN)).toBe(true);
    await repo.upsert({ token: TOKEN, userId: "ann", platform: "android", now: new Date() });
    await call("DELETE", `/devices/${TOKEN}`);
    expect(repo.rows.has(TOKEN)).toBe(false);
  });

  it("test push needs the permission and goes to the caller's own phones", async () => {
    expect((await api(staff).call("POST", "/push/test", {})).status).toBe(403);
    const { call, sender } = api(admin);
    await call("POST", "/devices", { token: TOKEN, platform: "android" });
    const response = await call("POST", "/push/test", {});
    expect(response.status).toBe(200);
    expect(sender.sent).toHaveLength(1);
    expect(sender.sent[0]?.payload.title).toBe("Igongo test notification");
  });

  it("broadcast needs the permission and refuses outside links", async () => {
    const message = { title: "Staff meeting", body: "4 PM in the hall", target: { kind: "topic", topic: "staff" } };
    expect((await api(staff).call("POST", "/push/broadcast", message)).status).toBe(403);
    const { call, sender } = api(admin);
    expect((await call("POST", "/push/broadcast", { ...message, link: "https://evil.example" })).status).toBe(400);
    expect((await call("POST", "/push/broadcast", { ...message, link: "/notice-board" })).status).toBe(200);
    expect(sender.sent[0]?.to).toBe("topic:staff");
  });
});
