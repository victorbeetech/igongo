/**
 * Saved delivery pin: each guest reads and changes only their own pin, and
 * nobody can reach it without signing in. Runs the real router with a
 * test-only sign-in header and an in-memory store.
 */

import type { Actor } from "@igongo/contracts/users-login";
import type { ActorEnv } from "@igongo/core";
import { Hono } from "hono";
import { beforeEach, describe, expect, it } from "vitest";
import type { OrderingDeps } from "../src/application/ordering-deps";
import { ordersRouter } from "../src/presentation/orders-router";
import { MemoryLocationRepository } from "./fakes/memory-location-repository";

/** A valid pin: Cottage 4 in Kakoba, Kampala. */
const pin = { label: "Cottage 4", zone: "kakoba", lat: 0.3136, lng: 32.5811 };

describe("saved delivery pin", () => {
  let locations: MemoryLocationRepository;
  let app: Hono<ActorEnv>;

  beforeEach(() => {
    locations = new MemoryLocationRepository();
    // Test sign-in: the `x-test-user` header stands in for the session, as the gateway does.
    app = new Hono<ActorEnv>();
    app.use("*", async (c, next) => {
      const userId = c.req.header("x-test-user");
      if (userId) c.set("actor", { userId, name: userId, sessionId: "s", email: "", access: { permissions: [] } } as unknown as Actor);
      await next();
    });
    // Anyone who reaches a signed-in route without a session is refused, as the gateway does.
    app.onError((_e, c) => c.json({ error: "denied" }, 401));
    const deps = { locations, change: { now: new Date("2026-11-27T10:00:00Z"), actorId: "test" } } as unknown as OrderingDeps;
    app.route("/api/orders", ordersRouter(() => deps));
  });

  /** Calls the API as [user] (or with no session when omitted). */
  const call = (method: string, path: string, user?: string, body?: unknown) =>
    app.request(path, {
      method,
      headers: { ...(user ? { "x-test-user": user } : {}), ...(body ? { "content-type": "application/json" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

  it("starts empty, then saves, reads back and removes the guest's own pin", async () => {
    expect(await (await call("GET", "/api/orders/location", "ama")).json()).toBeNull();
    const saved = await call("PUT", "/api/orders/location", "ama", pin);
    expect(saved.status).toBe(200);
    expect(await saved.json()).toMatchObject(pin);
    expect(await (await call("GET", "/api/orders/location", "ama")).json()).toMatchObject(pin);
    expect((await call("DELETE", "/api/orders/location", "ama")).status).toBe(204);
    expect(await (await call("GET", "/api/orders/location", "ama")).json()).toBeNull();
  });

  it("never shows one guest's pin to another guest", async () => {
    await call("PUT", "/api/orders/location", "ama", pin);
    // Bola's own pin is empty: Ama's point is never returned for her.
    expect(await (await call("GET", "/api/orders/location", "bola")).json()).toBeNull();
    // Bola saves her own pin; Ama still has hers, unchanged.
    await call("PUT", "/api/orders/location", "bola", { ...pin, label: "Plot 12" });
    expect(await (await call("GET", "/api/orders/location", "ama")).json()).toMatchObject({ label: "Cottage 4" });
    // Bola removing her pin leaves Ama's in place.
    await call("DELETE", "/api/orders/location", "bola");
    expect(await (await call("GET", "/api/orders/location", "ama")).json()).toMatchObject({ label: "Cottage 4" });
  });

  it("refuses every call without a session", async () => {
    expect((await call("GET", "/api/orders/location")).status).toBe(401);
    expect((await call("PUT", "/api/orders/location", undefined, pin)).status).toBe(401);
    expect((await call("DELETE", "/api/orders/location")).status).toBe(401);
  });

  it("rejects coordinates off the map and a missing point", async () => {
    expect((await call("PUT", "/api/orders/location", "ama", { ...pin, lat: 91 })).status).toBe(400);
    expect((await call("PUT", "/api/orders/location", "ama", { ...pin, lng: -181 })).status).toBe(400);
    expect((await call("PUT", "/api/orders/location", "ama", { label: "Cottage 4", zone: "kakoba" })).status).toBe(400);
    expect(await (await call("GET", "/api/orders/location", "ama")).json()).toBeNull();
  });
});
