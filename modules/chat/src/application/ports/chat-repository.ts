/** Where conversations, members and messages are kept. */

import type { Conversation } from "../../domain/conversation";
import type { Member } from "../../domain/member";
import type { Message } from "../../domain/message";

/** A conversation in a list, with who is in it and how many messages are unread. */
export type ConversationItem = Conversation & { members: { userId: string; name: string }[]; unread: number };

export interface ChatRepository {
  get(id: string): Promise<Conversation | null>;
  /** Conversations [userId] is in, and desk chats of [deskKeys], newest first. */
  listFor(userId: string, deskKeys: string[], limit: number): Promise<ConversationItem[]>;
  /** The direct chat between two people, if any. */
  directBetween(a: string, b: string): Promise<Conversation | null>;
  /** The guest's chat with a desk, if any. */
  deskChatOf(userId: string, deskKey: string): Promise<Conversation | null>;
  create(conversation: Conversation, members: Member[]): Promise<void>;
  members(conversationId: string): Promise<Member[]>;
  /** Adds a member once (a desk answerer joining). */
  addMember(member: Member): Promise<void>;
  addMessage(message: Message): Promise<void>;
  /** Messages after [after] (for polling), or the latest [limit], oldest first. */
  messages(conversationId: string, after: Date | null, limit: number): Promise<Message[]>;
  markRead(conversationId: string, userId: string, at: Date): Promise<void>;
}
