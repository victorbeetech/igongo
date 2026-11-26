/**
 * Card design HTTP routes, mounted by the gateway at `/api/cards/designs`
 * (before the cards router, behind the Staff Cards switch).
 *
 *   GET   /cards/designs         templates, card types, default and roles   S16-02 to S16-07, S16-19
 *   PUT   /cards/designs         save them (checked first)                  S16-03, S16-05, S16-07
 *   GET   /cards/designs/mine    the template for my own card                S16-19
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { DesignsDeps } from "../application/designs-deps";
import { saveDesigns } from "../application/use-cases/save-designs";
import { templateFor } from "../domain/card-designs";
import { DESIGN_PERMISSIONS as P } from "./permissions";
import { designsBody } from "./request-schemas";

export function designsRouter(deps: (c: Context<ActorEnv>) => DesignsDeps) {
  return new Hono<ActorEnv>()
    .get("/", requireSignIn, async (c) => c.json(await deps(c).store.read()))
    .get("/mine", requireSignIn, async (c) => {
      const designs = await deps(c).store.read();
      const template = templateFor(designs, actorOf(c).access.roles.map((r) => r.key));
      return c.json({ template, type: designs.types.find((t) => t.key === template?.cardType) ?? null });
    })
    .put("/", requireStaffPermission(P.edit), zValidator("json", designsBody), async (c) => c.json(await saveDesigns(deps(c), c.req.valid("json"))));
}
