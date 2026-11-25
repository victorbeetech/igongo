/**
 * Super Admin Console routes, mounted by the gateway at `/api/admin`, plus
 * the public settings at `/api/public`.
 *
 *   GET    /admin/modules              every module and its switch
 *   PATCH  /admin/modules/:key         on, off, maintenance and message
 *   GET    /admin/settings             every settings section
 *   PATCH  /admin/settings/:section    change hotel, branding or regional settings
 *   GET    /admin/keys                 which integration keys are set (never values)
 *   PUT    /admin/keys/:key            set a key (stored encrypted)
 *   DELETE /admin/keys/:key            remove a key
 *   GET    /public/settings            hotel and branding, for the login screen
 */

import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import { requirePermission, type ActorEnv, type ChangeContext } from "@igongo/core";
import type { ConsoleStore } from "../application/ports/console-store";
import type { Sealer } from "../application/ports/sealer";
import { listModules, setModuleState } from "../application/use-cases/module-switches";
import { deleteSecret, listSecrets, setSecret } from "../application/use-cases/secrets";
import { readSection, updateSection } from "../application/use-cases/settings";
import { PUBLIC_SECTIONS, SECTION_NAMES, type SettingsSection } from "../domain/settings-sections";
import { CONSOLE_PERMISSIONS as P } from "./permissions";
import { moduleBody, secretBody, sectionBody, sectionParam } from "./request-schemas";

/** What the routes need, built per request. */
export interface ConsoleDeps {
  store: ConsoleStore;
  /** Built only when a key is saved, so a missing master key breaks nothing else. */
  sealer: () => Promise<Sealer>;
  change: ChangeContext;
}

/** Several sections at once, as `{ name: value }`. */
async function sections(store: ConsoleStore, names: SettingsSection[]) {
  return Object.fromEntries(await Promise.all(names.map(async (n) => [n, await readSection(store, n)] as const)));
}

/** The admin routes. */
export function consoleRouter(deps: (c: Context<ActorEnv>) => ConsoleDeps) {
  return new Hono<ActorEnv>()
    .get("/modules", requirePermission(P.viewModules), async (c) => c.json({ items: await listModules(deps(c).store) }))
    .patch("/modules/:key", requirePermission(P.editModules), zValidator("json", moduleBody), async (c) => {
      return c.json(await setModuleState(deps(c).store, deps(c).change, c.req.param("key"), c.req.valid("json")));
    })
    .get("/settings", requirePermission(P.viewSettings), async (c) => c.json(await sections(deps(c).store, SECTION_NAMES)))
    .patch("/settings/:section", requirePermission(P.editSettings), zValidator("param", sectionParam), zValidator("json", sectionBody), async (c) => {
      const name = c.req.valid("param").section as SettingsSection;
      return c.json(await updateSection(deps(c).store, deps(c).change, name, c.req.valid("json")));
    })
    .get("/keys", requirePermission(P.viewKeys), async (c) => c.json({ items: await listSecrets(deps(c).store) }))
    .put("/keys/:key", requirePermission(P.editKeys), zValidator("json", secretBody), async (c) => {
      const d = deps(c);
      await setSecret(d.store, await d.sealer(), d.change, c.req.param("key"), c.req.valid("json").value);
      return c.body(null, 204);
    })
    .delete("/keys/:key", requirePermission(P.deleteKeys), async (c) => {
      await deleteSecret(deps(c).store, deps(c).change, c.req.param("key"));
      return c.body(null, 204);
    });
}

/** The public routes: only sections safe to show before sign-in. */
export function publicSettingsRouter(store: (c: Context<ActorEnv>) => ConsoleStore) {
  return new Hono<ActorEnv>().get("/settings", async (c) => {
    c.header("cache-control", "public, max-age=60");
    return c.json(await sections(store(c), PUBLIC_SECTIONS));
  });
}
