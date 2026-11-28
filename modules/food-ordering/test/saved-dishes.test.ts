/**
 * Saved dishes (the heart): a guest saves a real menu dish, sees today's name
 * and price, removes it, and never sees or changes another guest's list.
 * Runs the real router with a test-only sign-in header and fakes for the
 * menu and the store.
 */

import type { Actor } from "@igongo/contracts/users-login";
import { AppError, type ActorEnv } from "@igongo/core";
import type { MenuItemRef } from "@igongo/contracts/menu-catalogue";
import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { OrderingDeps } from "../src/application/ordering-deps";
import { ordersRouter } from "../src/presentation/orders-router";
import { MemorySavedDishRepository } from "./fakes/memory-saved-dish-repository";

/** Two dishes on the menu: one available, one switched off today. */
const menu: MenuItemRef[] = [
  { itemId: "eshabwe", outlet: "main", name: "Eshabwe", price: 25_000, prepMinutes: 20, available: true, options: [] },
  { itemId: "tilapia", outlet: "main", name: "Tilapia", price: 30_000, prepMinutes: 25, available: false, options: [] },
];

describe("saved dishes", () => {
  let dishes: MemorySavedDishRepository;
  let app: Hono<ActorEnv>;
  let menuItems: MenuItemRef[];

  beforeEach(() => {
    dishes = new MemorySavedDishRepository();
    menuItems = [...menu];
    // Test sign-in: the `x-test-user` header stands in for the session, as the gateway does.
    app = new Hono<ActorEnv>();
    app.use("*", async (c, next) => {
      const userId = c.req.header("x-test-user");
      if (userId) c.set("actor", { userId, name: userId, sessionId: "s", email: "", access: { permissions: [] } } as unknown as Actor);
      await next();
    });
    // Errors answer with the status their AppError carries; anything else is a refused sign-in.
    app.onError((e, c) => c.json({ error: e.message }, e instanceof AppError ? (e.status as 404) : 401));
    const deps = {
      savedDishes: dishes,
      // The fake menu returns only the dishes asked for that are still on it.
      menu: { items: async (ids: string[]) => menuItems.filter((i) => ids.includes(i.itemId)), outlet: async () => null },
      change: { now: new Date("2026-11-27T10:00:00Z"), actorId: "test" },
    } as unknown as OrderingDeps;
    app.route("/api/orders", ordersRouter(() => deps));
  });

  /** Calls the API as [user] (or with no session when omitted). */
  const call = (method: string, path: string, user?: string) =>
    app.request(path, { method, headers: user ? { "x-test-user": user } : {} });

  it("starts empty, saves a real dish, and shows its name and availability", async () => {
    expect(await (await call("GET", "/api/orders/dishes", "ama")).json()).toEqual({ items: [] });
    expect((await call("PUT", "/api/orders/dishes/eshabwe", "ama")).status).toBe(204);
    const list = (await (await call("GET", "/api/orders/dishes", "ama")).json()) as { items: { itemId: string; name: string; price: number; available: boolean }[] };
    expect(list.items).toHaveLength(1);
    expect(list.items[0]).toMatchObject({ itemId: "eshabwe", name: "Eshabwe", price: 25_000, available: true });
  });

  it("refuses a dish that is not on the menu", async () => {
    const res = await call("PUT", "/api/orders/dishes/not-a-dish", "ama");
    expect(res.status).toBe(404);
    expect(dishes.rows).toHaveLength(0);
  });

  it("keeps a dish that is off today, marked unavailable", async () => {
    await call("PUT", "/api/orders/dishes/tilapia", "ama");
    const list = (await (await call("GET", "/api/orders/dishes", "ama")).json()) as { items: { available: boolean }[] };
    expect(list.items[0]?.available).toBe(false);
  });

  it("leaves out a dish that has left the menu", async () => {
    await call("PUT", "/api/orders/dishes/eshabwe", "ama");
    menuItems = menuItems.filter((i) => i.itemId !== "eshabwe");
    expect(await (await call("GET", "/api/orders/dishes", "ama")).json()).toEqual({ items: [] });
  });

  it("removes a saved dish and treats a second removal as no error", async () => {
    await call("PUT", "/api/orders/dishes/eshabwe", "ama");
    expect((await call("DELETE", "/api/orders/dishes/eshabwe", "ama")).status).toBe(204);
    expect((await call("DELETE", "/api/orders/dishes/eshabwe", "ama")).status).toBe(204);
    expect(await (await call("GET", "/api/orders/dishes", "ama")).json()).toEqual({ items: [] });
  });

  it("never shows or changes one guest's saved dishes for another guest", async () => {
    await call("PUT", "/api/orders/dishes/eshabwe", "ama");
    // Bola's list is empty; she cannot see Ama's dish.
    expect(await (await call("GET", "/api/orders/dishes", "bola")).json()).toEqual({ items: [] });
    // Bola removing the same dish leaves Ama's saved dish in place.
    await call("DELETE", "/api/orders/dishes/eshabwe", "bola");
    expect(await (await call("GET", "/api/orders/dishes", "ama")).json()).toMatchObject({ items: [{ itemId: "eshabwe" }] });
  });

  it("refuses every saved-dish call without a session", async () => {
    expect((await call("GET", "/api/orders/dishes")).status).toBe(401);
    expect((await call("PUT", "/api/orders/dishes/eshabwe")).status).toBe(401);
    expect((await call("DELETE", "/api/orders/dishes/eshabwe")).status).toBe(401);
  });
});
