/**
 * Use case: tell people about something, in the app and on their phones, in one step.
 *
 * Every notification that reaches a person goes through here, so the Alerts
 * inbox (S00-28) and the push always match:
 *
 * 1. Work out the people (a role is turned into people on the server).
 * 2. Save one inbox item per person. The inbox is kept even when no push can
 *    be sent, so the person still sees it in the app.
 * 3. Send the push to their phones (skipped when `push` is false).
 *
 * A topic target has no list of people, so it sends the push only and writes no
 * inbox items. Topic targets are kept for public announcements.
 */

import type { PushPayload } from "../../domain/push-payload";
import type { PushResult } from "../../domain/push-result";
import type { PushTarget } from "../../domain/push-target";
import type { InboxRepository } from "../ports/inbox-repository";
import { recordInboxItems } from "./record-inbox-items";
import { sendPush, type SendPushDeps } from "./send-push";

/** What notifying needs: sending deps, plus the inbox and the clock. */
export interface NotifyPeopleDeps extends SendPushDeps {
  inbox: InboxRepository;
  now: () => Date;
  newId: () => string;
}

/** Options: `push: false` writes the inbox only (for channels that send nothing to phones). */
export interface NotifyPeopleOptions {
  push?: boolean;
}

/**
 * Notifies [target] with [payload]. Returns the push results (empty when
 * there is no push or nobody has a phone). The inbox write happens first.
 */
export async function notifyPeople(
  deps: NotifyPeopleDeps,
  target: PushTarget,
  payload: PushPayload,
  { push = true }: NotifyPeopleOptions = {},
): Promise<PushResult[]> {
  // Step 1: a topic has no people to write for, so it only sends.
  if (target.kind === "topic") return push ? sendPush(deps, target, payload) : [];

  // Step 2: turn a role into people once, so the inbox and the push use the same list.
  const userIds =
    target.kind === "roles" ? await deps.directory.usersWithRoles(target.roles) : target.userIds;
  const people = [...new Set(userIds)];

  // Step 3: one inbox item per person, with the same wording as the push.
  await recordInboxItems(
    { inbox: deps.inbox, now: deps.now, newId: deps.newId },
    people,
    { title: payload.title, body: payload.body, channel: payload.channel, link: payload.link },
  );

  // Step 4: the push, to the same people.
  if (!push) return [];
  return sendPush(deps, { kind: "users", userIds: people }, payload);
}
