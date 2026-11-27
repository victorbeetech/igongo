/**
 * The Alerts inbox in Postgres (Neon through Hyperdrive), with Drizzle.
 * Every query filters by the person's ID, so one person never sees or
 * changes another's items.
 */

import { and, count, desc, eq, isNull, lt, sql } from "drizzle-orm";
import type { PushChannelId } from "@igongo/contracts/notifications";
import type { InboxRepository } from "../../application/ports/inbox-repository";
import type { InboxItem } from "../../domain/inbox-item";
import type { NotificationsDb } from "./drizzle-device-token-repository";
import { inboxItems } from "./schema";

/** `InboxRepository` on Postgres. */
export class DrizzleInboxRepository implements InboxRepository {
  constructor(private readonly db: NotificationsDb) {}

  /** Saves one new item. */
  async add(item: InboxItem): Promise<void> {
    await this.db.insert(inboxItems).values({
      id: item.id,
      userId: item.userId,
      title: item.title,
      body: item.body,
      channel: item.channel,
      link: item.link,
      createdAt: item.createdAt,
      readAt: item.readAt,
    });
  }

  /** Newest first. [before] moves the page back to items created earlier than that time. */
  async listForUser(userId: string, limit: number, before?: Date): Promise<InboxItem[]> {
    const rows = await this.db
      .select()
      .from(inboxItems)
      .where(and(eq(inboxItems.userId, userId), before ? lt(inboxItems.createdAt, before) : undefined))
      .orderBy(desc(inboxItems.createdAt))
      .limit(limit);
    return rows.map((row) => ({ ...row, channel: row.channel as PushChannelId }));
  }

  /** Counts the person's items with no read time. */
  async unreadCount(userId: string): Promise<number> {
    const [row] = await this.db
      .select({ n: count() })
      .from(inboxItems)
      .where(and(eq(inboxItems.userId, userId), isNull(inboxItems.readAt)));
    return row?.n ?? 0;
  }

  /**
   * Marks one item read. The owner check is in the WHERE clause, so a
   * stranger's item is simply not found. An item already read keeps its
   * first read time (COALESCE).
   */
  async markRead(userId: string, id: string, now: Date): Promise<boolean> {
    const updated = await this.db
      .update(inboxItems)
      .set({ readAt: sql`coalesce(${inboxItems.readAt}, ${now})` })
      .where(and(eq(inboxItems.id, id), eq(inboxItems.userId, userId)))
      .returning({ id: inboxItems.id });
    return updated.length > 0;
  }

  /** Marks all of the person's unread items read, and returns how many changed. */
  async markAllRead(userId: string, now: Date): Promise<number> {
    const updated = await this.db
      .update(inboxItems)
      .set({ readAt: now })
      .where(and(eq(inboxItems.userId, userId), isNull(inboxItems.readAt)))
      .returning({ id: inboxItems.id });
    return updated.length;
  }
}
