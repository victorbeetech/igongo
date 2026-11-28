/**
 * Route guards shared by every module router: "must be signed in" and "must
 * hold permission X". They throw `AppError`, which the API shell turns into
 * a JSON reply, so routes stay one line long.
 */

import type { Context, MiddlewareHandler } from "hono";
import type { Actor } from "@igongo/contracts/users-login";
import { hasPermission } from "../access/permission-matches";
import { scopeOf } from "../access/scope-of";
import { SUPER_ADMIN_ROLE_KEY } from "@igongo/contracts/roles-permissions";
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

/**
 * True when [actor] holds the Super Admin role, the one role that can change
 * what the hotel sells and shows to guests (such as the venues list).
 */
export function isSuperAdmin(actor: Actor): boolean {
  // Step 1: look through the roles the person holds today, by their role key.
  return actor.access.roles.some((role) => role.key === SUPER_ADMIN_ROLE_KEY);
}

/**
 * Middleware: the caller must be the Super Admin. Any other role, even one with
 * the right permission, is refused.
 * @example router.put("/settings", requireSuperAdmin(), handler)
 */
export function requireSuperAdmin(): MiddlewareHandler<ActorEnv> {
  return async (c, next) => {
    // Step 1: nobody signed in is refused by actorOf; a signed-in non-super-admin is refused here.
    if (!isSuperAdmin(actorOf(c))) throw new AppError("permission_denied", "Only the super admin can change this.");
    // Step 2: the super admin goes on to the route.
    await next();
  };
}
