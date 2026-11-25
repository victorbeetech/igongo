// Fast lookups over the generated catalogue: a screen by number or route, a
// dialog by number or slug, a role by key. Built once when first imported.

import { allModules, allRoles } from "@/app/catalog/catalog.g";
import type { DialogSpec, ModuleSpec, ScreenSpec } from "./types";

// Step 1: index every screen, dialog and module.
const screens = new Map<string, ScreenSpec>();
const dialogs = new Map<string, DialogSpec>();
const dialogsBySlug = new Map<string, DialogSpec>();
const modules = new Map<string, ModuleSpec>();
for (const m of allModules) {
  modules.set(m.code, m);
  m.screens.forEach((s) => screens.set(s.id, s));
  m.dialogs.forEach((d) => {
    dialogs.set(d.id, d);
    dialogsBySlug.set(d.slug, d);
  });
}
// Step 2: index the roles.
const roles = new Map(allRoles.map((r) => [r.key, r]));

/** Lookups over every module, screen, dialog and role. */
export const catalog = {
  modules: allModules,
  roles: allRoles,
  /** A screen by number. */
  screen: (id: string) => screens.get(id),
  /** A dialog by number. */
  dialog: (id: string) => dialogs.get(id),
  /** A dialog by its `?dialog=` slug. */
  dialogBySlug: (slug: string) => dialogsBySlug.get(slug),
  /** A module by code. */
  module: (code: string) => modules.get(code)!,
  /** A role by key, or the super admin when the key is unknown. */
  role: (key: string) => roles.get(key) ?? roles.get("super-admin")!,
  /** The name of a screen or dialog, or "Home". */
  nameOf: (id: string) => screens.get(id)?.name ?? dialogs.get(id)?.name ?? "Home",
  /** The address of a screen, with a sample record number in place of `:id`. */
  hrefOf: (s: ScreenSpec) => s.route.replace(":id", "sample"),
  /** Every screen, for building the static pages. */
  allScreens: () => [...screens.values()],
  /** The screen at an address, matching `:id` to any record number. */
  screenAt(path: string): ScreenSpec | undefined {
    for (const s of screens.values()) {
      const pattern = new RegExp("^" + s.route.replace(":id", "[^/]+") + "$");
      if (pattern.test(path)) return s;
    }
    return undefined;
  },
};
