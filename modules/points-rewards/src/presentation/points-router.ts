/**
 * Points rewards HTTP routes, mounted by the gateway at `/api/points`. Paths here are relative to it.
 *
 *   GET  /api/points/rules          the public rules; `{ enabled: false }` while switched off (public)
 *   GET  /api/points/me             my wallet: balance, value, expiry, history (signed in; empty while off)
 *   GET  /api/points/admin/rules    every rule, for the super admin (view permission)
 *   PUT  /api/points/admin/rules    save every rule (edit permission)
 *   POST /api/points/admin/expire   run expiry now (edit permission)
 *   POST /api/points/admin/adjust   give or take away points by hand (adjust permission)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { PointsDeps } from "../application/points-deps";
import { adjustPoints } from "../application/use-cases/adjust";
import { expireDue } from "../application/use-cases/expire";
import { readRules, saveRules } from "../application/use-cases/rules";
import { walletFor } from "../application/use-cases/wallet";
import { POINTS_PERMISSIONS as P } from "./permissions";
import { adjustBody, rulesBody } from "./request-schemas";

/** Builds the router. [deps] is called per request so each request gets its own database connection. */
export function pointsRouter(deps: (c: Context<ActorEnv>) => PointsDeps) {
  return new Hono<ActorEnv>()
    // Public: the app reads this before sign-in. Switched off, it returns only the switch.
    .get("/rules", async (c) => {
      const rules = await readRules(deps(c));
      return c.json(rules.enabled ? rules : { enabled: false });
    })
    // My wallet. Switched off, the wallet holds only the switch and the app shows nothing.
    .get("/me", requireSignIn, async (c) => c.json(await walletFor(deps(c), actorOf(c).userId, new Date())))
    // The full rules for the super admin's screen, switched off or on.
    .get("/admin/rules", requireStaffPermission(P.view), async (c) => c.json(await readRules(deps(c))))
    .put("/admin/rules", requireStaffPermission(P.edit), zValidator("json", rulesBody), async (c) =>
      c.json(await saveRules(deps(c), c.req.valid("json"))),
    )
    .post("/admin/expire", requireStaffPermission(P.edit), async (c) => c.json(await expireDue(deps(c))))
    .post("/admin/adjust", requireStaffPermission(P.adjust), zValidator("json", adjustBody), async (c) => {
      const body = c.req.valid("json");
      const applied = await adjustPoints(deps(c), body);
      return c.json({ applied });
    });
}
