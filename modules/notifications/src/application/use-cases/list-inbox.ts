/**
 * Use case: one page of the caller's own inbox, newest first, with the unread count.
 */

import type { InboxPage } from "../../domain/inbox-page";
import type { InboxRepository } from "../ports/inbox-repository";

/** Page size the app asks for by default. */
export const DEFAULT_INBOX_PAGE = 20;

/**
 * Lists [limit] items of [userId] older than [before]. One extra row is read
 * to learn whether a next page exists, so the cursor is only set when it does.
 */
export async function listInbox(
  inbox: InboxRepository,
  userId: string,
  limit: number = DEFAULT_INBOX_PAGE,
  before?: Date,
): Promise<InboxPage> {
  // Step 1: read one more than the page, to know whether there is more.
  const rows = await inbox.listForUser(userId, limit + 1, before);
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  // Step 2: the badge counts every unread item, not only this page.
  const unreadCount = await inbox.unreadCount(userId);
  const last = items[items.length - 1];
  return { items, unreadCount, nextBefore: hasMore && last ? last.createdAt : null };
}
