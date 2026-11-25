/**
 * Notice Board HTTP routes, mounted by the gateway at `/api/notices`.
 *
 *   GET     /notices                 the board, pinned first (S49-01)
 *   POST    /notices                 publish a post (S49-03)
 *   GET     /notices/settings        board-wide switches (S49-05)
 *   PUT     /notices/settings        change them (S49-05)
 *   GET     /notices/:id             one post with comments; marks it read (S49-02)
 *   PATCH   /notices/:id             edit (author or editor)
 *   DELETE  /notices/:id             remove (author or remover)
 *   POST    /notices/:id/like        like or unlike
 *   POST    /notices/:id/comments    comment
 *   GET     /notices/:id/reads       who has read it (S49-04)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, can, recordChange, requirePermission, type ActorEnv } from "@igongo/core";
import type { Actor } from "@igongo/contracts/users-login";
import { Hono, type Context } from "hono";
import type { NoticesDeps } from "../application/notices-deps";
import { changeNotice } from "../application/use-cases/change-notice";
import { publishNotice } from "../application/use-cases/publish-notice";
import { addComment, toggleLike } from "../application/use-cases/react-to-notice";
import { canSee, type Notice } from "../domain/notice";
import { NOTICE_PERMISSIONS as P } from "./permissions";
import { commentBody, editBody, listQuery, publishBody, settingsBody } from "./request-schemas";

/** The board viewer from the signed-in caller. */
const viewerOf = (actor: Actor) => ({ userId: actor.userId, roleKeys: actor.access.roles.map((r) => r.key), isStaff: actor.access.isStaff });

export function noticesRouter(deps: (c: Context<ActorEnv>) => NoticesDeps) {
  /** The post in the address, if the caller may see it. @throws AppError `not_found` */
  async function visible(c: Context<ActorEnv>): Promise<Notice> {
    const notice = await deps(c).notices.get(c.req.param("id") as string);
    const actor = actorOf(c);
    // Authors and editors always see their posts, whatever the audience.
    if (!notice || (!canSee(notice, viewerOf(actor)) && notice.authorId !== actor.userId && !can(actor, P.edit))) throw new AppError("not_found", "Post not found.");
    if (notice.removedAt) throw new AppError("not_found", "Post not found.");
    return notice;
  }

  /** The caller may change [notice] with [permission], or is its author. @throws AppError `permission_denied` */
  function mayChange(c: Context<ActorEnv>, notice: Notice, permission: string) {
    const actor = actorOf(c);
    if (notice.authorId !== actor.userId && !can(actor, permission)) throw new AppError("permission_denied", `You need the permission ${permission}.`);
  }

  return (
    new Hono<ActorEnv>()
      .get("/", requirePermission(P.view), zValidator("query", listQuery), async (c) => {
        const d = deps(c);
        const { limit, offset } = c.req.valid("query");
        const actor = actorOf(c);
        return c.json({
          items: await d.notices.list(viewerOf(actor), limit, offset),
          settings: await d.settings.read(),
          // What this person's buttons should show.
          can: { post: can(actor, P.create), like: can(actor, P.like), comment: can(actor, P.comment) },
        });
      })
      .post("/", requirePermission(P.create), zValidator("json", publishBody), async (c) => {
        const actor = actorOf(c);
        return c.json(await publishNotice(deps(c), { userId: actor.userId, name: actor.name }, c.req.valid("json")), 201);
      })
      .get("/settings", async (c) => c.json(await deps(c).settings.read()))
      .put("/settings", requirePermission(P.settings), zValidator("json", settingsBody), async (c) => {
        const d = deps(c);
        const value = c.req.valid("json");
        await d.settings.write(value, d.change.actorId, d.change.now);
        await recordChange(d.change, { module: "notice-board", action: "board.settings_changed", recordType: "settings", recordId: "board", summary: `Notice board: comments ${value.commentsEnabled ? "on" : "off"}, likes ${value.likesEnabled ? "on" : "off"}` });
        return c.json(value);
      })
      .get("/:id", requirePermission(P.view), async (c) => {
        const d = deps(c);
        const notice = await visible(c);
        await d.notices.markRead(notice.id, actorOf(c).userId, d.change.now);
        return c.json({ notice, comments: await d.notices.comments(notice.id), likes: await d.notices.likeCount(notice.id), settings: await d.settings.read() });
      })
      .patch("/:id", zValidator("json", editBody), async (c) => {
        const notice = await visible(c);
        mayChange(c, notice, P.edit);
        return c.json(await changeNotice(deps(c), notice, { edit: c.req.valid("json") }));
      })
      .delete("/:id", async (c) => {
        const notice = await visible(c);
        mayChange(c, notice, P.delete);
        await changeNotice(deps(c), notice, { remove: true });
        return c.body(null, 204);
      })
      .post("/:id/like", requirePermission(P.like), async (c) => c.json(await toggleLike(deps(c), await visible(c), actorOf(c).userId)))
      .post("/:id/comments", requirePermission(P.comment), zValidator("json", commentBody), async (c) => {
        const actor = actorOf(c);
        return c.json(await addComment(deps(c), await visible(c), { userId: actor.userId, name: actor.name }, c.req.valid("json").body), 201);
      })
      .get("/:id/reads", async (c) => {
        const d = deps(c);
        const notice = await visible(c);
        mayChange(c, notice, P.edit);
        if (!(await d.settings.read()).readReceipts) throw new AppError("method_disabled", "Read receipts are switched off.");
        return c.json({ items: await d.notices.reads(notice.id) });
      })
  );
}
