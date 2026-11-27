/**
 * Port: where inbox items are kept. Every method takes the person's ID, so a
 * repository can only ever touch one person's items.
 */

import type { InboxItem } from "../../domain/inbox-item";

/** Stores and reads one person's inbox items. */
export interface InboxRepository {
  /** Saves a new item. */
  add(item: InboxItem): Promise<void>;
  /** Up to [limit] of the person's items, newest first, older than [before] when given. */
  listForUser(userId: string, limit: number, before?: Date): Promise<InboxItem[]>;
  /** How many of the person's items have no read time. */
  unreadCount(userId: string): Promise<number>;
  /** Marks one of the person's items read. False when it is not theirs or does not exist. */
  markRead(userId: string, id: string, now: Date): Promise<boolean>;
  /** Marks every unread item of the person read. Returns how many changed. */
  markAllRead(userId: string, now: Date): Promise<number>;
}
