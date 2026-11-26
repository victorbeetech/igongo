/** A person in a conversation, and how far they have read. */

export interface Member {
  conversationId: string;
  userId: string;
  name: string;
  /** Messages after this are unread. */
  lastReadAt: Date | null;
  joinedAt: Date;
}
