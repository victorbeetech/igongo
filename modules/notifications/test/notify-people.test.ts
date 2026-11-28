/**
 * Tests for notifyPeople, the one path every notification takes: the inbox
 * item is written for each person, the push goes to their phones, and a topic
 * sends a push without writing inbox items. Also checks that a rule with only
 * the inbox channel writes the inbox and sends no push.
 */

import { describe, expect, it } from "vitest";
import { notifyPeople } from "../src/application/use-cases/notify-people";
import { dispatchEvent } from "../src/application/use-cases/dispatch-event";
import type { NotificationRule } from "../src/domain/notification-rule";
import { MemoryAudienceDirectory } from "../src/infrastructure/memory/memory-audience-directory";
import { MemoryDeviceTokenRepository } from "../src/infrastructure/memory/memory-device-token-repository";
import { MemoryInboxRepository } from "../src/infrastructure/memory/memory-inbox-repository";
import { MemoryRuleSource } from "../src/infrastructure/memory/memory-rule-source";
import { MockPushSender } from "../src/infrastructure/memory/mock-push-sender";
import { samplePayload } from "./helpers";

/** Ann (phone), Bob (phone), Cat (no phone); the "chef" role holds Ann and Bob. */
async function setup(rules: NotificationRule[] = []) {
  const repo = new MemoryDeviceTokenRepository();
  const now = new Date("2026-11-28T08:00:00Z");
  await repo.upsert({ token: "ann-phone", userId: "ann", platform: "android", now });
  await repo.upsert({ token: "bob-phone", userId: "bob", platform: "ios", now });
  let counter = 0;
  return {
    repo,
    sender: new MockPushSender(),
    directory: new MemoryAudienceDirectory({ chef: ["ann", "bob"] }),
    inbox: new MemoryInboxRepository(),
    now: () => now,
    newId: () => `ntf_${++counter}`,
    rules: new MemoryRuleSource(rules),
  };
}

describe("notifyPeople", () => {
  it("writes one inbox item per person and pushes to their phones", async () => {
    const deps = await setup();
    const results = await notifyPeople(deps, { kind: "roles", roles: ["chef"] }, samplePayload);
    expect(results.map((r) => r.outcome)).toEqual(["sent", "sent"]);
    expect((await deps.inbox.listForUser("ann", 10)).length).toBe(1);
    expect((await deps.inbox.listForUser("bob", 10)).length).toBe(1);
    expect(await deps.inbox.unreadCount("cat")).toBe(0);
  });

  it("writes the inbox but sends no push when push is off", async () => {
    const deps = await setup();
    const results = await notifyPeople(deps, { kind: "users", userIds: ["ann"] }, samplePayload, { push: false });
    expect(results).toEqual([]);
    expect(deps.sender.sent.length).toBe(0);
    expect(await deps.inbox.unreadCount("ann")).toBe(1);
  });

  it("sends a topic push and writes no inbox items (topics have no list of people)", async () => {
    const deps = await setup();
    const results = await notifyPeople(deps, { kind: "topic", topic: "all" }, samplePayload);
    expect(results.map((r) => r.outcome)).toEqual(["sent"]);
    expect(await deps.inbox.unreadCount("ann")).toBe(0);
  });

  it("still writes the inbox when no push can be sent (Firebase not set up)", async () => {
    const deps = await setup();
    const { NotConfiguredPushSender } = await import("../src/infrastructure/not-configured-push-sender");
    const results = await notifyPeople({ ...deps, sender: new NotConfiguredPushSender() }, { kind: "users", userIds: ["ann"] }, samplePayload);
    expect(results.map((r) => r.outcome)).toEqual(["not_configured"]);
    expect(await deps.inbox.unreadCount("ann")).toBe(1);
  });
});

describe("dispatchEvent with the inbox channel", () => {
  const rule: NotificationRule = {
    id: "rule_1",
    name: "Order ready",
    event: "order.ready",
    enabled: true,
    channels: ["inbox"],
    audience: { roles: ["chef"], userIds: ["ann", "cat"] },
    pushChannel: "work",
    titleTemplate: "Order {ref} ready",
    bodyTemplate: "Table {table}",
  };

  it("writes one inbox item per person (Ann counted once) and sends no push", async () => {
    const deps = await setup([rule]);
    await dispatchEvent({ ...deps, rules: deps.rules }, { name: "order.ready", data: { ref: "7", table: "4" }, link: "/orders/7" });
    expect(await deps.inbox.unreadCount("ann")).toBe(1);
    expect(await deps.inbox.unreadCount("bob")).toBe(1);
    expect(await deps.inbox.unreadCount("cat")).toBe(1);
    expect(deps.sender.sent.length).toBe(0);
  });
});
