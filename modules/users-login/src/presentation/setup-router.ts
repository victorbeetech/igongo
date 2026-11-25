/**
 * The one-time first super admin set-up, mounted at `/api/setup`.
 *
 *   GET  /status   { needed: true } until a super admin exists (public)
 *   POST /claim    the owner, signed in with their verified Google account, claims the role
 */

import { Hono, type Context } from "hono";
import { actorOf, type ActorEnv } from "@igongo/core";
import { claimFirstSuperAdmin, setupNeeded } from "../application/use-cases/claim-first-super-admin";
import type { UsersDeps } from "./users-deps";

export function setupRouter(deps: (c: Context<ActorEnv>) => UsersDeps) {
  return new Hono<ActorEnv>()
    .get("/status", async (c) => c.json({ needed: await setupNeeded(deps(c)) }))
    .post("/claim", async (c) => {
      await claimFirstSuperAdmin(deps(c), actorOf(c).userId);
      return c.json({ ok: true });
    });
}
