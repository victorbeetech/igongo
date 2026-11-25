/**
 * Mounts the Notifications module (10). It was built before the gateway and
 * reads a simpler caller (`userId`, `isStaff`, permission keys), so this
 * adapter turns our `Actor` into that, and gives it its stores.
 */

import { createPushSender, DrizzleDeviceTokenRepository, notificationsRouter } from "@igongo/notifications";
import { newId } from "@igongo/core";
import { Hono } from "hono";
import type { ApiEnv } from "../shell/api-env";

export function createNotificationsRouter() {
  const inner = notificationsRouter((c) => {
    const api = c as unknown as import("hono").Context<ApiEnv>;
    const s = api.var.services;
    return {
      repo: new DrizzleDeviceTokenRepository(api.var.db),
      sender: createPushSender(api.env),
      directory: { usersWithRoles: (roles: string[]) => s.access().holdersOf(roles) },
      now: () => new Date(),
      newId: () => newId("ntf"),
    };
  });
  return new Hono<ApiEnv>()
    .use(async (c, next) => {
      const actor = c.var.actor;
      // The module's own actor shape, from ours.
      (c as unknown as { set: (k: string, v: unknown) => void }).set(
        "actor",
        actor ? { userId: actor.userId, isStaff: actor.access.isStaff, permissions: actor.access.permissions.map((p) => p.key) } : undefined,
      );
      await next();
    })
    .route("/", inner as unknown as Hono<ApiEnv>);
}
