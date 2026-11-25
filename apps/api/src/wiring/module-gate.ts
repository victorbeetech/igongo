/**
 * Refuses requests to a module the super admin switched off or put in
 * maintenance, with the message they wrote. Core modules are always on.
 */

import type { MiddlewareHandler } from "hono";
import { AppError } from "@igongo/core";
import type { ApiEnv } from "../shell/api-env";

export function moduleGate(moduleKey: string): MiddlewareHandler<ApiEnv> {
  return async (c, next) => {
    const state = await c.var.services.modules().stateOf(moduleKey);
    if (!state.enabled || state.maintenance) throw new AppError("module_disabled", state.message ?? "This part of the system is switched off for now.");
    await next();
  };
}
