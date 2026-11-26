/**
 * Mounts every records-kit module (build step 5: operations, HR extras,
 * guest service and money desks). Each sits behind its own module switch,
 * so the super admin can turn one off (or put it in maintenance) without
 * touching the others. The list is in record-modules.ts.
 */

import type { ActorEnv } from "@igongo/core";
import type { Context, Hono } from "hono";
import type { ApiEnv } from "../../shell/api-env";
import { mountModule as mount } from "../mount-module";
import { RECORD_MODULES, type RecordModuleEntry } from "./record-modules";

/** [entry]'s deps getter for its router. */
function depsOf(entry: RecordModuleEntry) {
  return (c: Context<ActorEnv>) => {
    return (c as unknown as Context<ApiEnv>).var.services.recordModule(entry, c.var.actor);
  };
}

export function mountRecordRoutes(app: Hono<ApiEnv>) {
  for (const entry of RECORD_MODULES) mount(app, entry.path, entry.key, entry.router(depsOf(entry)));
}
