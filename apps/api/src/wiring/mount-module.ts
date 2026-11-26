/**
 * Mounts a module's router at `/api/[path]` behind the switch of module
 * [key], so the super admin can turn it off (or put it in maintenance)
 * without touching the others. [before] runs after the switch let the
 * request in (such as loading deps that need an `await`). Shared by every
 * group of routes.
 */

import type { ActorEnv } from "@igongo/core";
import type { Hono, MiddlewareHandler } from "hono";
import type { ApiEnv } from "../shell/api-env";
import { moduleGate } from "./module-gate";

export function mountModule(app: Hono<ApiEnv>, path: string, key: string, router: Hono<ActorEnv>, before?: MiddlewareHandler<ApiEnv>) {
  for (const at of [`/api/${path}/*`, `/api/${path}`]) {
    app.use(at, moduleGate(key));
    if (before) app.use(at, before);
  }
  app.route(`/api/${path}`, router as unknown as Hono<ApiEnv>);
}
