/** `ChatRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, asc, count, desc, eq, gt, inArray, ne, or, sql } from "drizzle-orm";
import type { ChatRepository, ConversationItem } from "../../application/ports/chat-repository";
import type { Conversation, ConversationKind } from "../../domain/conversation";
import type { Member } from "../../domain/member";
import type { Message } from "../../domain/message";
import { conversations, members, messages } from "./schema";

const toConversation = (r: typeof conversations.$inferSelect): Conversation => ({ ...r, kind: r.kind as ConversationKind });

export class DrizzleChatRepository implements ChatRepository {
  constructor(private readonly db: Database) {}

  async get(id: string): Promise<Conversation | null> {
    const [row] = await this.db.select().from(conversations).where(eq(conversations.id, id));
    return row ? toConversation(row) : null;
  }

  async listFor(userId: string, deskKeys: string[], limit: number): Promise<ConversationItem[]> {
    const mine = sql`${conversations.id} in (select ${members.conversationId} from ${members} where ${members.userId} = ${userId})`;
    const rows = await this.db
      .select()
      .from(conversations)
      .where(deskKeys.length ? or(mine, inArray(conversations.deskKey, deskKeys)) : mine)
      .orderBy(desc(sql`coalesce(${conversations.lastMessageAt}, ${conversations.createdAt})`))
      .limit(limit);
    const ids = rows.map((r) => r.id);
    if (!ids.length) return [];
    const people = await this.db.select({ conversationId: members.conversationId, userId: members.userId, name: members.name }).from(members).where(inArray(members.conversationId, ids));
    // Unread: messages from others after my read marker (all of them when I have none).
    const unread = await this.db
      .select({ conversationId: messages.conversationId, n: count() })
      .from(messages)
      .leftJoin(members, and(eq(members.conversationId, messages.conversationId), eq(members.userId, userId)))
      .where(and(inArray(messages.conversationId, ids), ne(messages.senderId, userId), sql`${messages.at} > coalesce(${members.lastReadAt}, 'epoch'::timestamptz)`))
      .groupBy(messages.conversationId);
    const unreadOf = new Map(unread.map((u) => [u.conversationId, Number(u.n)]));
    return rows.map((r) => ({ ...toConversation(r), unread: unreadOf.get(r.id) ?? 0, members: people.filter((p) => p.conversationId === r.id).map((p) => ({ userId: p.userId, name: p.name })) }));
  }

  async directBetween(a: string, b: string): Promise<Conversation | null> {
    const [row] = await this.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.kind, "direct"),
          sql`exists(select 1 from ${members} where ${members.conversationId} = ${conversations.id} and ${members.userId} = ${a})`,
          sql`exists(select 1 from ${members} where ${members.conversationId} = ${conversations.id} and ${members.userId} = ${b})`,
        ),
      )
      .limit(1);
    return row ? toConversation(row) : null;
  }

  async deskChatOf(userId: string, deskKey: string): Promise<Conversation | null> {
    const [row] = await this.db.select().from(conversations).where(and(eq(conversations.kind, "desk"), eq(conversations.deskKey, deskKey), eq(conversations.createdBy, userId))).limit(1);
    return row ? toConversation(row) : null;
  }

  async create(conversation: Conversation, people: Member[]): Promise<void> {
    await this.db.insert(conversations).values(conversation);
    if (people.length) await this.db.insert(members).values(people);
  }

  members(conversationId: string): Promise<Member[]> {
    return this.db.select().from(members).where(eq(members.conversationId, conversationId)).orderBy(asc(members.joinedAt));
  }

  async addMember(member: Member): Promise<void> {
    await this.db.insert(members).values(member).onConflictDoNothing();
  }

  async addMessage(m: Message): Promise<void> {
    await this.db.insert(messages).values(m);
    await this.db.update(conversations).set({ lastMessageAt: m.at, lastPreview: m.body.slice(0, 120) || "Attachment" }).where(eq(conversations.id, m.conversationId));
  }

  async messages(conversationId: string, after: Date | null, limit: number): Promise<Message[]> {
    if (after) return this.db.select().from(messages).where(and(eq(messages.conversationId, conversationId), gt(messages.at, after))).orderBy(asc(messages.at)).limit(limit);
    // The latest [limit], shown oldest first.
    const latest = await this.db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(desc(messages.at)).limit(limit);
    return latest.reverse();
  }

  async markRead(conversationId: string, userId: string, at: Date): Promise<void> {
    await this.db.update(members).set({ lastReadAt: at }).where(and(eq(members.conversationId, conversationId), eq(members.userId, userId)));
  }
}
