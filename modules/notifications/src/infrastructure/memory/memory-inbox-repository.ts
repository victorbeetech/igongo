/** The Alerts inbox in memory, for tests and local development. Same rules as the Postgres version. */

import type { InboxRepository } from "../../application/ports/inbox-repository";
import type { InboxItem } from "../../domain/inbox-item";

/** `InboxRepository` in a Map. */
export class MemoryInboxRepository implements InboxRepository {
  /** Every item, by ID. */
  readonly rows = new Map<string, InboxItem>();

  /** Saves one new item. */
  async add(item: InboxItem): Promise<void> {
    this.rows.set(item.id, { ...item });
  }

  /** Newest first, only the person's own items, older than [before] when given. */
  async listForUser(userId: string, limit: number, before?: Date): Promise<InboxItem[]> {
    return [...this.rows.values()]
      .filter((row) => row.userId === userId && (!before || row.createdAt < before))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /** Counts the person's unread items. */
  async unreadCount(userId: string): Promise<number> {
    return [...this.rows.values()].filter((row) => row.userId === userId && row.readAt === null).length;
  }

  /** Marks one of the person's items read; keeps the first read time. */
  async markRead(userId: string, id: string, now: Date): Promise<boolean> {
    const row = this.rows.get(id);
    if (!row || row.userId !== userId) return false;
    row.readAt ??= now;
    return true;
  }

  /** Marks all of the person's unread items read. */
  async markAllRead(userId: string, now: Date): Promise<number> {
    let changed = 0;
    for (const row of this.rows.values()) {
      if (row.userId === userId && row.readAt === null) {
        row.readAt = now;
        changed += 1;
      }
    }
    return changed;
  }
}
