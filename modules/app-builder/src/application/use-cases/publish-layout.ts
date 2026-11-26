/**
 * Publishes a role's layout (S03-01): saves it with the next version
 * number, keeps the old one in the history, and records the change.
 * Rolling back (S03-09) publishes an old version again as a new one.
 */

import { AppError, recordChange } from "@igongo/core";
import { HISTORY_SIZE } from "../../domain/layout-version";
import type { RoleLayout } from "../../domain/role-layout";
import type { LayoutDeps } from "../layout-deps";

/** The parts of a layout the super admin edits. */
export type LayoutInput = Pick<RoleLayout, "menu" | "hidden" | "tabs" | "tiles">;

export async function publishLayout(deps: LayoutDeps, roleId: string, input: LayoutInput, note = "published"): Promise<RoleLayout> {
  const { store, change } = deps;
  // Step 1: the current layout and its history.
  const current = await store.layout(roleId);
  const history = await store.history(roleId);
  // Step 2: the new version, with repeats removed.
  const next: RoleLayout = {
    roleId,
    menu: [...new Set(input.menu)],
    hidden: [...new Set(input.hidden)],
    tabs: [...new Set(input.tabs)].slice(0, 5),
    tiles: [...new Set(input.tiles)],
    version: current.version + 1,
    updatedAt: change.now.toISOString(),
    updatedBy: change.actorId,
  };
  // Step 3: save it, put it on top of the history, and record the change.
  await store.saveLayout(next, change.actorId, change.now);
  const entry = { version: next.version, layout: next, publishedAt: next.updatedAt as string, publishedBy: change.actorId };
  await store.saveHistory(roleId, [entry, ...history].slice(0, HISTORY_SIZE), change.actorId, change.now);
  await recordChange(change, { module: "app-builder", action: "layout.published", recordType: "role", recordId: roleId, summary: `Layout v${next.version} ${note}: ${next.menu.length} menu items ordered, ${next.hidden.length} hidden, ${next.tabs.length} tabs, ${next.tiles.length} tiles` });
  return next;
}

/** Publishes past [version] of [roleId] again. @throws AppError `not_found` */
export async function rollBack(deps: LayoutDeps, roleId: string, version: number): Promise<RoleLayout> {
  const old = (await deps.store.history(roleId)).find((v) => v.version === version);
  if (!old) throw new AppError("not_found", `Version ${version} is not in this role's history.`);
  return publishLayout(deps, roleId, old.layout, `rolled back to v${version}`);
}
