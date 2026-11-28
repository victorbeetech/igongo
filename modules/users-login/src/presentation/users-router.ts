/**
 * Users & Login account routes, mounted by the gateway at `/api/users`.
 *
 *   GET    /me                        my account
 *   PUT    /me/photo                  save my profile photo (data URL, JPG or PNG)
 *   DELETE /me/photo                  remove my profile photo
 *   GET    /me/sessions               my signed-in devices
 *   DELETE /me/sessions/:sessionId    sign out one of my devices
 *   POST   /me/sessions/sign-out-others  sign out all my other devices
 *   GET    /                          search accounts (admin)
 *   POST   /                          create a staff account (admin)
 *   GET    /:id                       one account (admin)
 *   PATCH  /:id/status                approve, lock, unlock or suspend (admin)
 *   GET    /:id/sessions              their devices (admin)
 *   DELETE /:id/sessions              sign them out everywhere (admin)
 *   DELETE /:id/sessions/:sessionId   sign out one device (admin)
 *   POST   /sessions/sign-out-everyone   emergency: everyone but me (admin)
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import { actorOf, AppError, requirePermission, type ActorEnv } from "@igongo/core";
import { createStaffAccount } from "../application/use-cases/create-staff-account";
import { revokeAllSessions, revokeSession, setAccountStatus, signOutEveryone } from "../application/use-cases/manage-accounts";
import { checkProfilePhoto } from "../domain/profile-photo";
import { USER_PERMISSIONS as P } from "./permissions";
import { createAccountBody, photoBody, searchQuery, statusBody } from "./request-schemas";
import type { UsersDeps } from "./users-deps";

export function usersRouter(deps: (c: Context<ActorEnv>) => UsersDeps) {
  /** One account, or a 404. */
  const accountOr404 = async (c: Context<ActorEnv>, id: string) => {
    const account = await deps(c).accounts.get(id);
    if (!account) throw new AppError("not_found", "Account not found.");
    return account;
  };

  return (
    new Hono<ActorEnv>()
      // --- The caller's own account ---
      .get("/me", async (c) => c.json({ account: await accountOr404(c, actorOf(c).userId), access: actorOf(c).access }))
      // Saves my profile photo. The app crops it first; the server checks the type and size.
      .put("/me/photo", zValidator("json", photoBody), async (c) => {
        const image = checkProfilePhoto(c.req.valid("json").image);
        await deps(c).accounts.setImage(actorOf(c).userId, image);
        return c.json({ image });
      })
      .delete("/me/photo", async (c) => {
        await deps(c).accounts.setImage(actorOf(c).userId, null);
        return c.body(null, 204);
      })
      .get("/me/sessions", async (c) => {
        const me = actorOf(c);
        const items = await deps(c).accounts.sessionsOf(me.userId);
        return c.json({ items: items.map((s) => ({ ...s, current: s.id === me.sessionId })) });
      })
      .delete("/me/sessions/:sessionId", async (c) => {
        await revokeSession(deps(c).accounts, deps(c).change, actorOf(c).userId, c.req.param("sessionId"));
        return c.body(null, 204);
      })
      .post("/me/sessions/sign-out-others", async (c) => {
        const me = actorOf(c);
        return c.json({ signedOut: await revokeAllSessions(deps(c).accounts, deps(c).change, me.userId, me.sessionId) });
      })
      // --- Admin ---
      .post("/sessions/sign-out-everyone", requirePermission(P.revokeSessions), async (c) => {
        return c.json({ signedOut: await signOutEveryone(deps(c).accounts, deps(c).change, actorOf(c).sessionId) });
      })
      .get("/", requirePermission(P.viewAccounts), zValidator("query", searchQuery), async (c) => {
        const { q, ...rest } = c.req.valid("query");
        return c.json(await deps(c).accounts.search({ ...rest, ...(q ? { text: q } : {}) }));
      })
      .post("/", requirePermission(P.createAccounts), zValidator("json", createAccountBody), async (c) => {
        const d = deps(c);
        const writer = (await (await d.auth()).$context).internalAdapter;
        return c.json(await createStaffAccount(writer, d.change, c.req.valid("json")), 201);
      })
      .get("/:id", requirePermission(P.viewAccounts), async (c) => c.json(await accountOr404(c, c.req.param("id"))))
      .patch("/:id/status", requirePermission(P.editAccounts), zValidator("json", statusBody), async (c) => {
        await setAccountStatus(deps(c).accounts, deps(c).change, c.req.param("id"), c.req.valid("json").status);
        return c.body(null, 204);
      })
      .get("/:id/sessions", requirePermission(P.viewAccounts), async (c) => c.json({ items: await deps(c).accounts.sessionsOf(c.req.param("id")) }))
      .delete("/:id/sessions", requirePermission(P.revokeSessions), async (c) => {
        return c.json({ signedOut: await revokeAllSessions(deps(c).accounts, deps(c).change, c.req.param("id")) });
      })
      .delete("/:id/sessions/:sessionId", requirePermission(P.revokeSessions), async (c) => {
        await revokeSession(deps(c).accounts, deps(c).change, c.req.param("id"), c.req.param("sessionId"));
        return c.body(null, 204);
      })
  );
}
