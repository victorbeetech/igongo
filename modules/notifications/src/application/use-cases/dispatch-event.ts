/**
 * Use case: the notification rules hook. When any module publishes an event
 * (such as `fault.reported`), every switched-on rule for that event with the
 * `push` channel sends its push. Other channels (SMS, WhatsApp, email, inbox)
 * plug in here when they are built.
 */

import type { DomainEvent } from "@igongo/contracts/notifications";
import { fillTemplate } from "../../domain/notification-rule";
import type { PushResult } from "../../domain/push-result";
import type { RuleSource } from "../ports/rule-source";
import { sendPush, type SendPushDeps } from "./send-push";

/** Runs every matching rule for [event] and returns all push results. */
export async function dispatchEvent(
  deps: SendPushDeps & { rules: RuleSource; newId: () => string },
  event: DomainEvent,
): Promise<PushResult[]> {
  const results: PushResult[] = [];
  for (const rule of await deps.rules.enabledRulesFor(event.name)) {
    // 1. Only rules that use push are handled here.
    if (!rule.channels.includes("push")) continue;

    // 2. Fill the rule's wording from the event.
    const payload = {
      notificationId: deps.newId(),
      title: fillTemplate(rule.titleTemplate, event.data),
      body: fillTemplate(rule.bodyTemplate, event.data),
      channel: rule.pushChannel,
      ...(event.link ? { link: event.link } : {}),
    };

    // 3. Everyone in the rule's roles plus its named people, once each, so
    //    someone who is both gets one push, not two.
    const fromRoles = rule.audience.roles.length > 0 ? await deps.directory.usersWithRoles(rule.audience.roles) : [];
    const userIds = [...new Set([...fromRoles, ...rule.audience.userIds])];
    results.push(...(await sendPush(deps, { kind: "users", userIds }, payload)));
  }
  return results;
}
