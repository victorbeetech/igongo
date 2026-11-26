/**
 * Route guards shared by every module router: "must be signed in" and "must
 * hold permission X". They throw `AppError`, which the API shell turns into
 * a JSON reply, so routes stay one line long.
 */

import type { Context, MiddlewareHandler } from "hono";
import type { Actor } from "@igongo/contracts/users-login";
import { hasPermission } from "../access/permission-matches";
import { scopeOf } from "../access/scope-of";
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

/**
 * True when [actor] holds [permission] for other people's records, not only
 * their own. Guest roles hold wildcards such as `food-ordering.*.edit` with
 * scope `own` (change my order); staff tools and settings need more than that.
 */
export function canForOthers(actor: Actor, permission: string): boolean {
  const scope = scopeOf(actor, permission);
  return scope !== null && scope !== "own" && scope !== "public";
}

/**
 * Middleware: the caller must hold [permission] with a scope wider than
 * `own` (staff tools and super admin settings).
 * @example router.put("/rules", requireStaffPermission("food-ordering.rules.edit"), handler)
 */
export function requireStaffPermission(permission: string): MiddlewareHandler<ActorEnv> {
  return async (c, next) => {
    if (!canForOthers(actorOf(c), permission)) throw new AppError("permission_denied", `You need the permission ${permission}.`);
    await next();
  };
}
