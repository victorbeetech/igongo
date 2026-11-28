/**
 * Use case: the notification rules hook. When any module publishes an event
 * (such as `fault.reported`), every switched-on rule for that event with the
 * `push` or `inbox` channel notifies its people through `notifyPeople`, which
 * writes the inbox item and (for `push`) the phone push. Other channels (SMS,
 * WhatsApp, email) plug in here when they are built.
 */

import type { DomainEvent } from "@igongo/contracts/notifications";
import { fillTemplate } from "../../domain/notification-rule";
import type { PushResult } from "../../domain/push-result";
import type { RuleSource } from "../ports/rule-source";
import { notifyPeople, type NotifyPeopleDeps } from "./notify-people";

/** Runs every matching rule for [event] and returns all push results. */
export async function dispatchEvent(
  deps: NotifyPeopleDeps & { rules: RuleSource },
  event: DomainEvent,
): Promise<PushResult[]> {
  const results: PushResult[] = [];
  for (const rule of await deps.rules.enabledRulesFor(event.name)) {
    // 1. Only rules that use push or the inbox are handled here.
    const push = rule.channels.includes("push");
    if (!push && !rule.channels.includes("inbox")) continue;

    // 2. Fill the rule's wording from the event.
    const payload = {
      notificationId: deps.newId(),
      title: fillTemplate(rule.titleTemplate, event.data),
      body: fillTemplate(rule.bodyTemplate, event.data),
      channel: rule.pushChannel,
      ...(event.link ? { link: event.link } : {}),
    };

    // 3. Everyone in the rule's roles plus its named people, once each, so
    //    someone who is both gets one inbox item and one push, not two.
    const userIds = [...new Set([...(await rolesToPeople(deps, rule.audience.roles)), ...rule.audience.userIds])];
    results.push(...(await notifyPeople(deps, { kind: "users", userIds }, payload, { push })));
  }
  return results;
}

/** The people holding [roles]; none when the rule names no roles. */
async function rolesToPeople(deps: NotifyPeopleDeps, roles: string[]): Promise<string[]> {
  return roles.length > 0 ? deps.directory.usersWithRoles(roles) : [];
}
