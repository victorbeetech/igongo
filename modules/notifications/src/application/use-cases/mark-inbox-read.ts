/**
 * Use cases: mark one of the caller's items read, or all of them. A person
 * can never mark another person's item, because the repository checks the owner.
 */

import type { InboxRepository } from "../ports/inbox-repository";

/** Marks item [id] read. False when it is not the caller's or does not exist. */
export function markInboxItemRead(inbox: InboxRepository, now: () => Date, userId: string, id: string): Promise<boolean> {
  return inbox.markRead(userId, id, now());
}

/** Marks every unread item of the caller read. Returns how many changed. */
export function markAllInboxRead(inbox: InboxRepository, now: () => Date, userId: string): Promise<number> {
  return inbox.markAllRead(userId, now());
}
