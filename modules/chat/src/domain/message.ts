/** One chat message. Kept for ever (permanent records). */

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  body: string;
  /** Photos or documents from Files & Media. */
  fileIds: string[];
  at: Date;
}
