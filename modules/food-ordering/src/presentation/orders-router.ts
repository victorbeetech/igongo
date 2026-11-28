/**
 * Food Ordering HTTP routes, mounted by the gateway at `/api/orders`.
 *
 *   GET   /orders/rules           order types and rules, for the cart (S62-05)
 *   PUT   /orders/rules           change them (S62-16)
 *   POST  /orders/quote           price and ready time of a cart (S62-04, S62-06)
 *   POST  /orders                 place an order (S62-08), or take one for a guest (S62-14)
 *   GET   /orders/mine            my orders, each marked rated or not (S62-11)
 *   GET   /orders/cart            my saved cart (empty when none)
 *   PUT   /orders/cart            replace my saved cart (kept across app restarts)
 *   DELETE /orders/cart           empty my saved cart
 *   GET   /orders/location        my saved delivery pin, or null
 *   PUT   /orders/location        save my delivery pin (the map point)
 *   DELETE /orders/location       remove my saved delivery pin
 *   GET   /orders/dishes          my saved dishes, with today's names and prices
 *   PUT   /orders/dishes/:itemId  save a dish to my list (the heart)
 *   DELETE /orders/dishes/:itemId remove a dish from my list
 *   GET   /orders/stars           each dish's average stars, for the menu
 *   GET   /orders/reviews         newest reviews (all=1: staff, with hidden ones)
 *   POST  /orders/reviews/:id/hide  staff hide or show a review
 *   GET   /orders/board           the staff board (S62-12)
 *   GET   /orders/:id             one order, with its timeline (S62-10, S62-13)
 *   POST  /orders/:id/status      kitchen or front of house moves it on
 *   POST  /orders/:id/cancel      cancel, with a reason
 *   POST  /orders/:id/rating      the guest rates a delivered order (once)
 *   GET   /orders/:id/reorder     the same dishes at today's prices, for the cart
 *
 * Someone else's order answers 403. Every price and total is worked out on
 * the server; the app's numbers are never used.
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, canForOthers, omitKey, recordChange, requirePermission, requireSignIn, requireStaffPermission, type ActorEnv } from "@igongo/core";
import type { Actor } from "@igongo/contracts/users-login";
import { Hono, type Context } from "hono";
import type { OrderingDeps } from "../application/ordering-deps";
import { advanceOrder, cancelOrder } from "../application/use-cases/change-order";
import { placeOrder } from "../application/use-cases/place-order";
import { hideReview, rateOrder } from "../application/use-cases/rate-order";
import { reorder } from "../application/use-cases/reorder";
import { clearSavedCart, readSavedCart, saveCart } from "../application/use-cases/guest-cart";
import { clearSavedLocation, readSavedLocation, saveLocation } from "../application/use-cases/guest-location";
import { listSavedDishes, removeDish, saveDish } from "../application/use-cases/saved-dishes";
import { priceCart } from "../application/use-cases/price-cart";
import { orderNumber, type Order } from "../domain/order";
import type { OrderRating } from "../domain/order-rating";
import { nextStatuses } from "../domain/order-flow";
import { ORDER_PERMISSIONS as P } from "./permissions";
import { savedCartBody } from "./cart-schemas";
import { boardQuery, cancelBody, cartBody, hideBody, pinBody, placeBody, ratingBody, reviewsQuery, rulesBody, statusBody } from "./request-schemas";

/** True when [actor] works the orders (board, kitchen or front of house). Guests hold these only as `own`. */
const isOrderStaff = (actor: Actor) => [P.view, P.kitchen, P.kitchenView, P.edit].some((p) => canForOthers(actor, p));

/** An order as the screens show it: with its number and the next steps staff may take. */
const shown = (o: Order) => ({ ...o, number: orderNumber(o.seq), next: nextStatuses(o.status, o.type) });

/** A review as anyone may see it: first name, stars and words, no account or order IDs. */
const publicReview = (r: OrderRating) => ({ name: r.name, outlet: r.outlet, food: r.food, delivery: r.delivery, comment: r.comment, createdAt: r.createdAt });

/** @throws AppError 403 unless [order] is the caller's own or they work the orders */
function mayRead(actor: Actor, order: Order) {
  if (order.userId !== actor.userId && !isOrderStaff(actor)) throw new AppError("permission_denied", "This order is not yours.");
}

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
    .get("/mine", requireSignIn, async (c) => {
      const d = deps(c);
      const items = await d.orders.list({ userId: actorOf(c).userId, limit: 100 });
      const rated = await d.ratings.ratedAmong(items.map((o) => o.id));
      return c.json({ items: items.map((o) => ({ ...shown(o), rated: rated.has(o.id) })) });
    })
    // Saved cart: always the caller's own (the user ID comes from the session, never the URL or body).
    .get("/cart", requireSignIn, async (c) => c.json(await readSavedCart(deps(c), actorOf(c).userId)))
    .put("/cart", requireSignIn, zValidator("json", savedCartBody), async (c) => {
      const body = c.req.valid("json");
      return c.json(await saveCart(deps(c), actorOf(c).userId, body.outlet, body.lines));
    })
    .delete("/cart", requireSignIn, async (c) => {
      await clearSavedCart(deps(c), actorOf(c).userId);
      return c.body(null, 204);
    })
    // Saved delivery pin: always the caller's own, as with the cart above.
    .get("/location", requireSignIn, async (c) => c.json(await readSavedLocation(deps(c), actorOf(c).userId)))
    .put("/location", requireSignIn, zValidator("json", pinBody), async (c) => c.json(await saveLocation(deps(c), actorOf(c).userId, c.req.valid("json"))))
    .delete("/location", requireSignIn, async (c) => {
      await clearSavedLocation(deps(c), actorOf(c).userId);
      return c.body(null, 204);
    })
    // Saved dishes: always the caller's own list (the user ID comes from the session).
    .get("/dishes", requireSignIn, async (c) => {
      const items = await listSavedDishes(deps(c), actorOf(c).userId);
      return c.json({ items });
    })
    .put("/dishes/:itemId", requireSignIn, async (c) => {
      await saveDish(deps(c), actorOf(c).userId, c.req.param("itemId"));
      return c.body(null, 204);
    })
    .delete("/dishes/:itemId", requireSignIn, async (c) => {
      await removeDish(deps(c), actorOf(c).userId, c.req.param("itemId"));
      return c.body(null, 204);
    })
    .get("/stars", async (c) => c.json({ items: await deps(c).ratings.stars() }))
    .get("/reviews", zValidator("query", reviewsQuery), async (c) => {
      const { outlet, all } = c.req.valid("query");
      // Hidden reviews and IDs are for staff only.
      if (all) {
        const actor = c.var.actor;
        if (!actor || !canForOthers(actor, P.edit)) throw new AppError("permission_denied", `You need the permission ${P.edit}.`);
        return c.json({ items: await deps(c).ratings.list({ ...(outlet ? { outlet } : {}), withHidden: true, limit: 200 }) });
      }
      return c.json({ items: (await deps(c).ratings.list({ ...(outlet ? { outlet } : {}), withHidden: false, limit: 50 })).map(publicReview) });
    })
    .post("/reviews/:orderId/hide", requireStaffPermission(P.edit), zValidator("json", hideBody), async (c) => {
      await hideReview(deps(c), c.req.param("orderId"), c.req.valid("json").hidden);
      return c.body(null, 204);
    })
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
      if (!order) throw new AppError("not_found", "Order not found.");
      mayRead(actor, order);
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
    })
    .post("/:id/rating", requireSignIn, zValidator("json", ratingBody), async (c) => {
      const actor = actorOf(c);
      return c.json(await rateOrder(deps(c), c.req.param("id"), { userId: actor.userId, name: actor.name }, c.req.valid("json")), 201);
    })
    .get("/:id/reorder", requireSignIn, async (c) => c.json(await reorder(deps(c), c.req.param("id"), actorOf(c).userId)));
}
