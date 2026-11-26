/**
 * Chat HTTP routes, mounted by the gateway at `/api/chat`. The app and web
 * poll for new messages with `after` (live push comes with the realtime
 * service later).
 *
 *   GET   /chat/conversations                 my chats, with unread counts   S50-01
 *   POST  /chat/conversations                 start a direct or group chat   S50-01
 *   GET   /chat/desks                         desks a guest can write to     S50-03
 *   POST  /chat/desks/:key                    open my chat with a desk       S50-03
 *   GET   /chat/conversations/:id/messages    messages (after a time)        S50-02
 *   POST  /chat/conversations/:id/messages    send                           S50-02
 *   POST  /chat/conversations/:id/read        mark read                      S50-02
 *   GET   /chat/people?q                      staff to chat with             S50-01
 *   GET   /chat/settings                      chat settings                  S50-05
 *   PUT   /chat/settings                      change them                    S50-05
 */

import { zValidator } from "@hono/zod-validator";
import type { Actor } from "@igongo/contracts/users-login";
import { actorOf, AppError, recordChange, requirePermission, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { ChatDeps } from "../application/chat-deps";
import { sendMessage } from "../application/use-cases/send-message";
import { openDesk, startDirect, startGroup } from "../application/use-cases/start-conversation";
import { desksOf, type ChatViewer } from "../domain/chat-viewer";
import type { Conversation } from "../domain/conversation";
import { CHAT_PERMISSIONS as P } from "./permissions";
import { messageBody, messagesQuery, peopleQuery, settingsBody, startBody } from "./request-schemas";

/** The chat viewer from the signed-in caller. */
const viewerOf = (a: Actor): ChatViewer => ({ userId: a.userId, name: a.name, isStaff: a.access.isStaff, roleKeys: a.access.roles.map((r) => r.key) });

export function chatRouter(deps: (c: Context<ActorEnv>) => ChatDeps) {
  /** The conversation in the address, if the caller is in it or answers its desk. @throws AppError `not_found` */
  async function reachable(c: Context<ActorEnv>): Promise<Conversation> {
    const d = deps(c);
    const conv = await d.chats.get(c.req.param("id") as string);
    const me = viewerOf(actorOf(c));
    const member = conv && (await d.chats.members(conv.id)).some((m) => m.userId === me.userId);
    const answers = conv?.deskKey ? desksOf((await d.settings.read()).desks, me).includes(conv.deskKey) : false;
    if (!conv || (!member && !answers)) throw new AppError("not_found", "Chat not found.");
    return conv;
  }

  return new Hono<ActorEnv>()
    .get("/conversations", requirePermission(P.view), async (c) => {
      const d = deps(c);
      const me = viewerOf(actorOf(c));
      const settings = await d.settings.read();
      return c.json({ items: await d.chats.listFor(me.userId, desksOf(settings.desks, me), 100), settings: { staffChat: settings.staffChat, groups: settings.groups, guestChat: settings.guestChat, attachments: settings.attachments } });
    })
    .post("/conversations", requirePermission(P.create), zValidator("json", startBody), async (c) => {
      const body = c.req.valid("json");
      const me = viewerOf(actorOf(c));
      const conv = body.kind === "direct" ? await startDirect(deps(c), me, body.userId) : await startGroup(deps(c), me, body.title, body.userIds);
      return c.json(conv, 201);
    })
    .get("/desks", requirePermission(P.view), async (c) => {
      const s = await deps(c).settings.read();
      return c.json({ items: s.guestChat ? s.desks.map((d) => ({ key: d.key, name: d.name })) : [] });
    })
    .post("/desks/:key", requirePermission(P.create), async (c) => c.json(await openDesk(deps(c), viewerOf(actorOf(c)), c.req.param("key")), 201))
    .get("/conversations/:id/messages", requirePermission(P.view), zValidator("query", messagesQuery), async (c) => {
      const conv = await reachable(c);
      const q = c.req.valid("query");
      return c.json({ conversation: conv, members: await deps(c).chats.members(conv.id), items: await deps(c).chats.messages(conv.id, q.after ?? null, q.limit) });
    })
    .post("/conversations/:id/messages", requirePermission(P.create), zValidator("json", messageBody), async (c) => {
      const body = c.req.valid("json");
      return c.json(await sendMessage(deps(c), await reachable(c), viewerOf(actorOf(c)), body.body, body.fileIds), 201);
    })
    .post("/conversations/:id/read", requirePermission(P.view), async (c) => {
      const d = deps(c);
      await d.chats.markRead((await reachable(c)).id, actorOf(c).userId, d.change.now);
      return c.body(null, 204);
    })
    .get("/people", requirePermission(P.create), zValidator("query", peopleQuery), async (c) => {
      if (!actorOf(c).access.isStaff) throw new AppError("permission_denied", "Only staff can start chats with staff.");
      const q = c.req.valid("query").q.toLowerCase();
      const people = (await deps(c).staff.active()).filter((s) => s.userId && s.userId !== actorOf(c).userId && (!q || s.name.toLowerCase().includes(q)));
      return c.json({ items: people.slice(0, 50).map((s) => ({ userId: s.userId, name: s.name, department: s.department, jobTitle: s.jobTitle })) });
    })
    .get("/settings", requirePermission(P.view), async (c) => c.json(await deps(c).settings.read()))
    .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
      const d = deps(c);
      const value = c.req.valid("json");
      await d.settings.write(value, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "chat", action: "settings.changed", recordType: "settings", recordId: "settings", summary: `Chat: staff ${value.staffChat ? "on" : "off"}, guests ${value.guestChat ? "on" : "off"}, ${value.desks.length} desks` });
      return c.json(value);
    });
}
