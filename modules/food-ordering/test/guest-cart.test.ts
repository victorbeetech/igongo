/**
 * Saved guest cart: each guest reads and changes only their own cart, and
 * nobody can reach it without signing in. Runs the real router with a
 * test-only sign-in header, and an in-memory store.
 */

import type { Actor } from "@igongo/contracts/users-login";
import type { ActorEnv } from "@igongo/core";
import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { OrderingDeps } from "../src/application/ordering-deps";
import type { SavedCart } from "../src/domain/saved-cart";
import { ordersRouter } from "../src/presentation/orders-router";
import { MemoryCartRepository } from "./fakes/memory-cart-repository";

/** The line Ama (guest A) saves. */
const amaLine = { itemId: "itm_beef", name: "Fried beef", quantity: 2, unitPrice: 20000, options: ["portion:1kg"], date: null, notes: "no onions" };

describe("saved guest cart", () => {
  let carts: MemoryCartRepository;
  let app: Hono<ActorEnv>;

  beforeEach(() => {
    carts = new MemoryCartRepository();
    // Test sign-in: the `x-test-user` header stands in for the session, as the gateway does.
    app = new Hono<ActorEnv>();
    app.use("*", async (c, next) => {
      const userId = c.req.header("x-test-user");
      if (userId) c.set("actor", { userId, name: userId, sessionId: "s", email: "", access: { permissions: [] } } as unknown as Actor);
      await next();
    });
    app.onError((_e, c) => c.json({ error: "denied" }, 401));
    const deps = { carts, change: { now: new Date("2026-11-27T10:00:00Z"), actorId: "test" } } as unknown as OrderingDeps;
    app.route("/api/orders", ordersRouter(() => deps));
  });

  const call = (method: string, path: string, user?: string, body?: unknown) =>
    app.request(path, {
      method,
      headers: { ...(user ? { "x-test-user": user } : {}), ...(body ? { "content-type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });

  it("keeps the guest's cart after it is saved, so a restart shows it again", async () => {
    const saved = await call("PUT", "/api/orders/cart", "guest-ama", { outlet: "main-kitchen", lines: [amaLine] });
    expect(saved.status).toBe(200);
    const again = await call("GET", "/api/orders/cart", "guest-ama");
    const cart = (await again.json()) as SavedCart;
    expect(cart.outlet).toBe("main-kitchen");
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0]?.itemId).toBe("itm_beef");
  });

  it("never shows one guest's cart to another guest", async () => {
    await call("PUT", "/api/orders/cart", "guest-ama", { outlet: "main-kitchen", lines: [amaLine] });
    const bo = (await (await call("GET", "/api/orders/cart", "guest-bo")).json()) as SavedCart;
    expect(bo).toMatchObject({ outlet: null, lines: [] });
  });

  it("lets another guest neither empty nor overwrite someone else's cart", async () => {
    await call("PUT", "/api/orders/cart", "guest-ama", { outlet: "main-kitchen", lines: [amaLine] });
    // Bo empties "their" cart: only Bo's own row goes, Ama's stays.
    expect((await call("DELETE", "/api/orders/cart", "guest-bo")).status).toBe(204);
    // Bo saves a different cart: Ama's cart is untouched.
    await call("PUT", "/api/orders/cart", "guest-bo", { outlet: "pool-bar", lines: [{ ...amaLine, itemId: "itm_juice", name: "Juice" }] });
    const ama = (await (await call("GET", "/api/orders/cart", "guest-ama")).json()) as SavedCart;
    expect(ama.outlet).toBe("main-kitchen");
    expect(ama.lines[0]?.itemId).toBe("itm_beef");
    expect(carts.rows.size).toBe(2);
  });

  it("refuses the cart without a sign-in", async () => {
    await call("PUT", "/api/orders/cart", "guest-ama", { outlet: "main-kitchen", lines: [amaLine] });
    const anon = await call("GET", "/api/orders/cart");
    expect(anon.status).toBe(401);
    expect(await anon.text()).not.toContain("itm_beef");
  });

  it("rejects a cart with a bad quantity", async () => {
    const bad = await call("PUT", "/api/orders/cart", "guest-ama", { outlet: "main-kitchen", lines: [{ ...amaLine, quantity: 0 }] });
    expect(bad.status).toBeGreaterThanOrEqual(400);
    expect(carts.rows.size).toBe(0);
  });

  it("an empty cart saves with no outlet", async () => {
    await call("PUT", "/api/orders/cart", "guest-ama", { outlet: "main-kitchen", lines: [amaLine] });
    const cleared = await (await call("PUT", "/api/orders/cart", "guest-ama", { outlet: "main-kitchen", lines: [] })).json();
    expect(cleared).toMatchObject({ outlet: null, lines: [] });
  });
});
