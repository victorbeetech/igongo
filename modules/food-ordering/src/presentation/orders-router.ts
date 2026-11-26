/**
 * Food Ordering HTTP routes, mounted by the gateway at `/api/orders`.
 *
 *   GET   /orders/rules           order types and rules, for the cart (S62-05)
 *   PUT   /orders/rules           change them (S62-16)
 *   POST  /orders/quote           price and ready time of a cart (S62-04, S62-06)
 *   POST  /orders                 place an order (S62-08), or take one for a guest (S62-14)
 *   GET   /orders/mine            my orders (S62-11)
 *   GET   /orders/board           the staff board (S62-12)
 *   GET   /orders/:id             one order, with its timeline (S62-10, S62-13)
 *   POST  /orders/:id/status      kitchen or front of house moves it on
 *   POST  /orders/:id/cancel      cancel, with a reason
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, canForOthers, omitKey, recordChange, requirePermission, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import type { Actor } from "@igongo/contracts/users-login";
import { Hono, type Context } from "hono";
import type { OrderingDeps } from "../application/ordering-deps";
import { advanceOrder, cancelOrder } from "../application/use-cases/change-order";
import { placeOrder } from "../application/use-cases/place-order";
import { priceCart } from "../application/use-cases/price-cart";
import { orderNumber, type Order } from "../domain/order";
import { nextStatuses } from "../domain/order-flow";
import { ORDER_PERMISSIONS as P } from "./permissions";
import { boardQuery, cancelBody, cartBody, placeBody, rulesBody, statusBody } from "./request-schemas";

/** True when [actor] works the orders (board, kitchen or front of house). Guests hold these only as `own`. */
const isOrderStaff = (actor: Actor) => [P.view, P.kitchen, P.kitchenView, P.edit].some((p) => canForOthers(actor, p));

/** An order as the screens show it: with its number and the next steps staff may take. */
const shown = (o: Order) => ({ ...o, number: orderNumber(o.seq), next: nextStatuses(o.status, o.type) });

/** The cart with its arrival time as a date. */
function cartOf<T extends { arriveAt?: string | undefined }>(body: T): Omit<T, "arriveAt"> & { arriveAt?: Date } {
  const { arriveAt, ...rest } = body;
  return { ...rest, ...(arriveAt ? { arriveAt: new Date(arriveAt) } : {}) };
}

export function ordersRouter(deps: (c: Context<ActorEnv>) => OrderingDeps) {
  return new Hono<ActorEnv>()
    .get("/rules", async (c) => c.json(await deps(c).rules.read()))
    .put("/rules", requireStaffPermission(P.rules), zValidator("json", rulesBody), async (c) => {
      const d = deps(c);
      const rules = c.req.valid("json");
      await d.rules.write(rules, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "food-ordering", action: "orders.rules_changed", recordType: "settings", recordId: "rules", summary: `Changed ordering rules (pre-order notice ${rules.preorderMinNoticeMinutes} min, deposit ${rules.depositPercent}%)` });
      return c.json(rules);
    })
    .post("/quote", zValidator("json", cartBody), async (c) => {
      const priced = await priceCart(deps(c), cartOf(c.req.valid("json")));
      return c.json(omitKey(priced, "rules"));
    })
    .post("/", requirePermission(P.create), zValidator("json", placeBody), async (c) => {
      const actor = actorOf(c);
      const { customer, notes, allergies, table, ...cart } = c.req.valid("json");
      // Staff taking an order for someone else name the customer; guests order for themselves.
      const forOther = !!customer && canForOthers(actor, P.create);
      if (customer && !forOther) throw new AppError("permission_denied", "Only staff can take orders for other people.");
      const order = await placeOrder(deps(c), {
        ...cartOf(cart),
        customer: forOther ? { userId: null, name: customer.name, phone: customer.phone ?? null } : { userId: actor.userId, name: actor.name, phone: null },
        channel: forOther ? "staff" : "app",
        ...(notes ? { notes } : {}), ...(allergies ? { allergies } : {}), ...(table ? { table } : {}),
      });
      return c.json(shown(order), 201);
    })
    .get("/mine", requireSignIn, async (c) => c.json({ items: (await deps(c).orders.list({ userId: actorOf(c).userId, limit: 100 })).map(shown) }))
    .get("/board", requireSignIn, zValidator("query", boardQuery), async (c) => {
      if (!isOrderStaff(actorOf(c))) throw new AppError("permission_denied", `You need the permission ${P.view}.`);
      const { outlet, status } = c.req.valid("query");
      // Open orders, plus the last 12 hours' finished ones for the "done" column.
      const since = new Date(deps(c).change.now.getTime() - 12 * 3_600_000);
      const items = await deps(c).orders.list({ ...(outlet ? { outlet } : {}), ...(status ? { statuses: [status] } : {}), since, limit: 300 });
      return c.json({ items: items.map(shown) });
    })
    .get("/:id", requireSignIn, async (c) => {
      const actor = actorOf(c);
      const order = await deps(c).orders.byId(c.req.param("id"));
      if (!order || (order.userId !== actor.userId && !isOrderStaff(actor))) throw new AppError("not_found", "Order not found.");
      return c.json(shown(order));
    })
    .post("/:id/status", requireSignIn, zValidator("json", statusBody), async (c) => {
      const actor = actorOf(c);
      if (!canForOthers(actor, P.edit) && !canForOthers(actor, P.kitchen)) throw new AppError("permission_denied", `You need the permission ${P.edit}.`);
      return c.json(shown(await advanceOrder(deps(c), c.req.param("id"), c.req.valid("json").status)));
    })
    .post("/:id/cancel", requireSignIn, zValidator("json", cancelBody), async (c) => {
      const actor = actorOf(c);
      const order = await cancelOrder(deps(c), c.req.param("id"), { userId: actor.userId, staff: canForOthers(actor, P.edit) }, c.req.valid("json").reason);
      return c.json(shown(order));
    });
}
