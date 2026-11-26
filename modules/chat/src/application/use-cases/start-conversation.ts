/**
 * Use cases: start a direct or group chat (staff, S50-01), and open a guest's
 * chat with a desk (S50-03). A direct chat between the same two people is
 * reused, as is a guest's chat with the same desk.
 */

import { AppError, newId } from "@igongo/core";
import type { Conversation } from "../../domain/conversation";
import type { ChatViewer } from "../../domain/chat-viewer";
import type { ChatDeps } from "../chat-deps";

/** A new conversation record. */
const fresh = (deps: ChatDeps, by: string, kind: Conversation["kind"], title: string | null, deskKey: string | null): Conversation => ({ id: newId("cnv"), kind, title, deskKey, createdBy: by, createdAt: deps.change.now, lastMessageAt: null, lastPreview: null });

/** A direct chat with [otherUserId], who must be active staff. */
export async function startDirect(deps: ChatDeps, me: ChatViewer, otherUserId: string): Promise<Conversation> {
  if (!me.isStaff || !(await deps.settings.read()).staffChat) throw new AppError("method_disabled", "Staff chat is switched off.");
  if (otherUserId === me.userId) throw new AppError("bad_request", "Choose someone else.");
  const other = await deps.staff.byUserId(otherUserId);
  if (!other || other.status !== "active") throw new AppError("bad_request", "Choose an active staff member.");
  const existing = await deps.chats.directBetween(me.userId, otherUserId);
  if (existing) return existing;
  const c = fresh(deps, me.userId, "direct", null, null);
  const now = deps.change.now;
  await deps.chats.create(c, [
    { conversationId: c.id, userId: me.userId, name: me.name, lastReadAt: now, joinedAt: now },
    { conversationId: c.id, userId: otherUserId, name: other.name, lastReadAt: null, joinedAt: now },
  ]);
  return c;
}

/** A staff group named [title] with [userIds]. */
export async function startGroup(deps: ChatDeps, me: ChatViewer, title: string, userIds: string[]): Promise<Conversation> {
  const settings = await deps.settings.read();
  if (!me.isStaff || !settings.staffChat || !settings.groups) throw new AppError("method_disabled", "Group chats are switched off.");
  const others = [...new Set(userIds.filter((u) => u !== me.userId))];
  if (others.length + 1 > settings.maxGroupSize) throw new AppError("bad_request", `A group can have at most ${settings.maxGroupSize} people.`);
  const people = await Promise.all(others.map((u) => deps.staff.byUserId(u)));
  if (people.some((p) => !p || p.status !== "active")) throw new AppError("bad_request", "Everyone in a group must be active staff.");
  const c = fresh(deps, me.userId, "group", title, null);
  const now = deps.change.now;
  await deps.chats.create(c, [{ conversationId: c.id, userId: me.userId, name: me.name, lastReadAt: now, joinedAt: now }, ...people.map((p, i) => ({ conversationId: c.id, userId: others[i] as string, name: p?.name ?? "", lastReadAt: null, joinedAt: now }))]);
  return c;
}

/** The guest's chat with desk [deskKey]. */
export async function openDesk(deps: ChatDeps, me: ChatViewer, deskKey: string): Promise<Conversation> {
  const settings = await deps.settings.read();
  const desk = settings.desks.find((d) => d.key === deskKey);
  if (!settings.guestChat || !desk) throw new AppError("method_disabled", "Chat with the hotel is switched off.");
  const existing = await deps.chats.deskChatOf(me.userId, deskKey);
  if (existing) return existing;
  const c = fresh(deps, me.userId, "desk", desk.name, desk.key);
  await deps.chats.create(c, [{ conversationId: c.id, userId: me.userId, name: me.name, lastReadAt: deps.change.now, joinedAt: deps.change.now }]);
  return c;
}
