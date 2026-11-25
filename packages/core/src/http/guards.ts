/**
 * Route guards shared by every module router: "must be signed in" and "must
 * hold permission X". They throw `AppError`, which the API shell turns into
 * a JSON reply, so routes stay one line long.
 */

import type { Context, MiddlewareHandler } from "hono";
import type { Actor } from "@igongo/contracts/users-login";
import { hasPermission } from "../access/permission-matches";
import { AppError } from "../errors/app-error";
import type { ActorEnv } from "./actor-env";

/**
 * The signed-in caller.
 * @throws AppError `sign_in_required` when nobody is signed in
 */
export function actorOf(c: Context<ActorEnv>): Actor {
  const actor = c.get("actor");
  if (!actor) throw new AppError("sign_in_required", "Please sign in.");
  return actor;
}

/** True when the caller holds [permission] through any of their roles. */
export function can(actor: Actor, permission: string): boolean {
  return hasPermission(
    actor.access.permissions.map((p) => p.key),
    permission,
  );
}

/**
 * Middleware: the caller must be signed in and hold [permission].
 * @example router.get("/roles", requirePermission("roles-permissions.roles.view"), handler)
 */
export function requirePermission(permission: string): MiddlewareHandler<ActorEnv> {
  return async (c, next) => {
    if (!can(actorOf(c), permission)) throw new AppError("permission_denied", `You need the permission ${permission}.`);
    await next();
  };
}

/** Middleware: the caller must be signed in (any role). */
export const requireSignIn: MiddlewareHandler<ActorEnv> = async (c, next) => {
  actorOf(c);
  await next();
};
