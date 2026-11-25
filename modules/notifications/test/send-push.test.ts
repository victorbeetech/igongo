/** Tests sending to people, roles and topics, and the rules hook, with the mock sender. */

import { describe, expect, it } from "vitest";
import { dispatchEvent } from "../src/application/use-cases/dispatch-event";
import { sendPush } from "../src/application/use-cases/send-push";
import type { NotificationRule } from "../src/domain/notification-rule";
import { MemoryAudienceDirectory } from "../src/infrastructure/memory/memory-audience-directory";
import { MemoryDeviceTokenRepository } from "../src/infrastructure/memory/memory-device-token-repository";
import { MemoryRuleSource } from "../src/infrastructure/memory/memory-rule-source";
import { MockPushSender } from "../src/infrastructure/memory/mock-push-sender";
import { samplePayload } from "./helpers";

/** A repository with Ann (two phones, one dead), Bob and Cat (no phone). */
async function setup() {
  const repo = new MemoryDeviceTokenRepository();
  const now = new Date();
  await repo.upsert({ token: "ann-phone", userId: "ann", platform: "android", now });
  await repo.upsert({ token: "dead-ann-old", userId: "ann", platform: "ios", now });
  await repo.upsert({ token: "bob-phone", userId: "bob", platform: "ios", now });
  const sender = new MockPushSender();
  const directory = new MemoryAudienceDirectory({ chef: ["ann", "bob"], gm: ["cat"] });
  return { repo, sender, directory };
}

describe("sendPush", () => {
  it("sends to every phone of the people and deletes dead tokens", async () => {
    const deps = await setup();
    const results = await sendPush(deps, { kind: "users", userIds: ["ann"] }, samplePayload);
    expect(results.map((r) => r.outcome)).toEqual(["sent", "invalid_token"]);
    expect(deps.sender.sent.map((s) => s.to)).toEqual(["ann-phone"]);
    expect(deps.repo.rows.has("dead-ann-old")).toBe(false);
  });

  it("turns roles into people on the server", async () => {
    const deps = await setup();
    await sendPush(deps, { kind: "roles", roles: ["chef"] }, samplePayload);
    expect(deps.sender.sent.map((s) => s.to).sort()).toEqual(["ann-phone", "bob-phone"]);
  });

  it("sends nothing to people with no phone", async () => {
    const deps = await setup();
    expect(await sendPush(deps, { kind: "roles", roles: ["gm"] }, samplePayload)).toEqual([]);
    expect(await sendPush(deps, { kind: "roles", roles: ["nobody"] }, samplePayload)).toEqual([]);
  });

  it("sends a topic straight to the push service", async () => {
    const deps = await setup();
    await sendPush(deps, { kind: "topic", topic: "clients" }, samplePayload);
    expect(deps.sender.sent.map((s) => s.to)).toEqual(["topic:clients"]);
  });
});

describe("dispatchEvent (notification rules hook)", () => {
  const rule: NotificationRule = {
    id: "r1",
    name: "Faults to maintenance",
    event: "fault.reported",
    enabled: true,
    channels: ["push", "sms"],
    audience: { roles: ["chef"], userIds: ["bob"] },
    pushChannel: "urgent",
    titleTemplate: "Fault in {place}",
    bodyTemplate: "{summary}",
  };

  it("sends each matching push rule once per person, with the wording filled in", async () => {
    const deps = { ...(await setup()), newId: () => "n9" };
    const rules = new MemoryRuleSource([rule, { ...rule, id: "r2", enabled: false }, { ...rule, id: "r3", channels: ["sms"] }]);
    await dispatchEvent({ ...deps, rules }, { name: "fault.reported", data: { place: "Room 12", summary: "No hot water" }, link: "/faults/1" });

    expect(deps.sender.sent.map((s) => s.to).sort()).toEqual(["ann-phone", "bob-phone"]);
    expect(deps.sender.sent[0]?.payload).toEqual({
      notificationId: "n9",
      title: "Fault in Room 12",
      body: "No hot water",
      channel: "urgent",
      link: "/faults/1",
    });
  });

  it("does nothing for events with no rule", async () => {
    const deps = { ...(await setup()), newId: () => "n9", rules: new MemoryRuleSource([rule]) };
    expect(await dispatchEvent(deps, { name: "order.placed", data: {} })).toEqual([]);
  });
});
