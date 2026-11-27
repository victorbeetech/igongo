/**
 * Use case: keep one inbox item for each person who is told about something.
 * It runs next to the push, so the inbox always has what the phone showed.
 */

import type { PushChannelId } from "@igongo/contracts/notifications";
import type { InboxItem } from "../../domain/inbox-item";
import type { InboxRepository } from "../ports/inbox-repository";

/** What recording needs. */
export interface RecordInboxDeps {
  inbox: InboxRepository;
  now: () => Date;
  newId: () => string;
}

/** The text of one notification, as the sender wrote it. */
export interface InboxMessage {
  title: string;
  body: string;
  channel: PushChannelId;
  link?: string;
}

/** Saves one inbox item per person in [userIds]. Duplicate IDs are counted once. */
export async function recordInboxItems(deps: RecordInboxDeps, userIds: string[], message: InboxMessage): Promise<void> {
  const people = [...new Set(userIds)].filter(Boolean);
  const createdAt = deps.now();
  // Each person gets their own copy, so each can read and mark it alone.
  for (const userId of people) {
    const item: InboxItem = {
      id: deps.newId(),
      userId,
      title: message.title,
      body: message.body,
      channel: message.channel,
      link: message.link ?? null,
      createdAt,
      readAt: null,
    };
    await deps.inbox.add(item);
  }
}
