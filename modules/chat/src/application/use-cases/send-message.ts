/**
 * Use case: send a message (S50-02). A desk answerer joins the chat on their
 * first reply, so the guest sees who answered and read markers work.
 */

import { AppError, newId } from "@igongo/core";
import type { Conversation } from "../../domain/conversation";
import type { ChatViewer } from "../../domain/chat-viewer";
import type { Message } from "../../domain/message";
import type { ChatDeps } from "../chat-deps";

export async function sendMessage(deps: ChatDeps, c: Conversation, me: ChatViewer, body: string, fileIds: string[]): Promise<Message> {
  // 1. Attachments, when the super admin allows them.
  if (fileIds.length) {
    if (!(await deps.settings.read()).attachments) throw new AppError("method_disabled", "Attachments are switched off.");
    if ((await deps.files.known(fileIds)).length !== new Set(fileIds).size) throw new AppError("bad_request", "One of the files was not found. Upload it again.");
  }
  if (!body.trim() && !fileIds.length) throw new AppError("bad_request", "Write a message.");
  const now = deps.change.now;
  // 2. Desk answerers join on their first reply.
  if (c.kind === "desk" && !(await deps.chats.members(c.id)).some((m) => m.userId === me.userId)) await deps.chats.addMember({ conversationId: c.id, userId: me.userId, name: me.name, lastReadAt: now, joinedAt: now });
  // 3. The message; the sender has read up to it.
  const message: Message = { id: newId("msg"), conversationId: c.id, senderId: me.userId, senderName: me.name, body: body.trim(), fileIds, at: now };
  await deps.chats.addMessage(message);
  await deps.chats.markRead(c.id, me.userId, now);
  return message;
}
