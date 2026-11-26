/**
 * Menus & Catalogue HTTP routes, mounted by the gateway at `/api/menu`.
 * The menu itself is public, so guests can browse before signing in.
 *
 *   GET    /menu/outlets            outlets in the client view (S62-01)
 *   GET    /menu/items?outlet&all   the menu (S61-01, S62-02); `all=1` for staff
 *   GET    /menu/items/:id          one item (S62-03)
 *   POST   /menu/items              add an item (S61-03)
 *   PATCH  /menu/items/:id          change an item (S61-03)
 *   POST   /menu/items/:id/stock    out of stock today, or back (S61-04)
 *   GET|PUT /menu/settings          outlets (S61-01)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, canForOthers, recordChange, requireStaffPermission, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { MenuDeps } from "../application/menu-deps";
import { addItem, editItem, setInStock } from "../application/use-cases/save-item";
import { isAvailable, type MenuItem } from "../domain/menu-item";
import { MENU_PERMISSIONS as P } from "./permissions";
import { itemBody, itemPatch, itemsQuery, settingsBody, stockBody } from "./request-schemas";

/** True when the caller (maybe nobody) is staff holding [permission] (guests hold menu view as `public`). */
function callerCan(c: Context<ActorEnv>, permission: string): boolean {
  const actor = c.get("actor");
  return !!actor && canForOthers(actor, permission);
}

/** An item as the menu shows it, with today's availability. */
const shown = (item: MenuItem, now: Date) => ({ ...item, available: isAvailable(item, now) });

export function menuRouter(deps: (c: Context<ActorEnv>) => MenuDeps) {
  return new Hono<ActorEnv>()
    .get("/outlets", async (c) => {
      const s = await deps(c).settings.read();
      return c.json({ items: callerCan(c, P.view) ? s.outlets : s.outlets.filter((o) => s.clientOutlets.includes(o.key)) });
    })
    .get("/items", zValidator("query", itemsQuery), async (c) => {
      const d = deps(c);
      const { outlet, all } = c.req.valid("query");
      const staff = all === "1" && callerCan(c, P.view);
      const s = await d.settings.read();
      // The client view: only switched-on, visible items of client outlets.
      const items = (await d.items.list(outlet ? { outlet } : {})).filter((i) => staff || (i.active && i.visibleToClients && s.clientOutlets.includes(i.outlet)));
      return c.json({ items: items.map((i) => shown(i, d.change.now)) });
    })
    .get("/items/:id", async (c) => {
      const d = deps(c);
      const item = await d.items.byId(c.req.param("id"));
      if (!item || (!callerCan(c, P.view) && (!item.active || !item.visibleToClients))) throw new AppError("not_found", "Menu item not found.");
      return c.json(shown(item, d.change.now));
    })
    .post("/items", requireStaffPermission(P.create), zValidator("json", itemBody), async (c) => c.json(await addItem(deps(c), c.req.valid("json")), 201))
    .patch("/items/:id", requireStaffPermission(P.edit), zValidator("json", itemPatch), async (c) => c.json(await editItem(deps(c), c.req.param("id"), c.req.valid("json"))))
    .post("/items/:id/stock", zValidator("json", stockBody), async (c) => {
      // The kitchen display's chefs may flip stock without menu edit rights.
      const actor = actorOf(c);
      if (![P.stock, P.kitchen, P.edit].some((p) => canForOthers(actor, p))) throw new AppError("permission_denied", `You need the permission ${P.stock}.`);
      return c.json(await setInStock(deps(c), c.req.param("id"), c.req.valid("json").inStock));
    })
    .get("/settings", async (c) => c.json(await deps(c).settings.read()))
    .put("/settings", requireStaffPermission(P.settings), zValidator("json", settingsBody), async (c) => {
      const d = deps(c);
      const value = c.req.valid("json");
      await d.settings.write(value, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "menu-catalogue", action: "menu.settings_changed", recordType: "settings", recordId: "menu", summary: `Outlets: ${value.outlets.map((o) => o.name).join(", ") || "none"}` });
      return c.json(value);
    });
}
