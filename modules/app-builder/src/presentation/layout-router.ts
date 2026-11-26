/**
 * App Layout HTTP routes, mounted by the gateway at `/api/layout`. The app
 * and the web portal draw their menus, tabs and home tiles from `/me`.
 *
 *   GET   /layout/me                        my combined layout               (every screen)
 *   GET   /layout/public                    modules open before sign-in      S03-06
 *   GET   /layout/roles/:roleId             one role's layout                S03-01, S03-08
 *   PUT   /layout/roles/:roleId             publish a new version            S03-01, S03-04
 *   GET   /layout/roles/:roleId/history     past versions                    S03-09
 *   POST  /layout/roles/:roleId/rollback    publish an old version again     S03-09
 *   GET   /layout/settings                  public screens, client view      S03-06, S03-07
 *   PUT   /layout/settings                  change them                      S03-06, S03-07
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, recordChange, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import { z } from "zod";
import type { LayoutDeps } from "../application/layout-deps";
import { publishLayout, rollBack } from "../application/use-cases/publish-layout";
import { resolveLayout } from "../domain/resolve-layout";
import { LAYOUT_PERMISSIONS as P } from "./permissions";
import { layoutBody, settingsBody } from "./request-schemas";

export function layoutRouter(deps: (c: Context<ActorEnv>) => LayoutDeps) {
  return new Hono<ActorEnv>()
    .get("/me", requireSignIn, async (c) => {
      const access = actorOf(c).access;
      const { store } = deps(c);
      const [layouts, settings] = await Promise.all([store.layouts(access.roles.map((r) => r.id)), store.settings()]);
      return c.json(resolveLayout(access, layouts, settings));
    })
    .get("/public", async (c) => c.json({ modules: (await deps(c).store.settings()).publicModules }))
    .get("/roles/:roleId", requireStaffPermission(P.view), async (c) => c.json(await deps(c).store.layout(c.req.param("roleId"))))
    .put("/roles/:roleId", requireStaffPermission(P.edit), zValidator("json", layoutBody), async (c) => c.json(await publishLayout(deps(c), c.req.param("roleId"), c.req.valid("json"))))
    .get("/roles/:roleId/history", requireStaffPermission(P.view), async (c) => c.json({ items: await deps(c).store.history(c.req.param("roleId")) }))
    .post("/roles/:roleId/rollback", requireStaffPermission(P.edit), zValidator("json", z.object({ version: z.number().int().min(1) })), async (c) =>
      c.json(await rollBack(deps(c), c.req.param("roleId"), c.req.valid("json").version)),
    )
    .get("/settings", requireStaffPermission(P.view), async (c) => c.json(await deps(c).store.settings()))
    .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
      const d = deps(c);
      const s = c.req.valid("json");
      await d.store.saveSettings(s, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "app-builder", action: "layout.settings_changed", recordType: "settings", recordId: "settings", summary: `${s.publicModules.length} public modules; client view for ${s.clientViewRoles.join(", ") || "nobody"}; test marks ${s.markTestOrders ? "on" : "off"}` });
      return c.json(s);
    });
}
