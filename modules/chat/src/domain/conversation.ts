/**
 * A conversation (S50-01): `direct` between two people, a staff `group`, or
 * `desk`: a guest talking to a hotel desk (such as the front desk), answered
 * by whoever holds that desk's roles.
 */

export const CONVERSATION_KINDS = ["direct", "group", "desk"] as const;
export type ConversationKind = (typeof CONVERSATION_KINDS)[number];

export interface Conversation {
  id: string;
  kind: ConversationKind;
  /** Group name, or the desk's name for desk chats; null for direct chats. */
  title: string | null;
  /** The desk key for desk chats. */
  deskKey: string | null;
  createdBy: string;
  createdAt: Date;
  lastMessageAt: Date | null;
  /** The start of the last message, for lists. */
  lastPreview: string | null;
}
