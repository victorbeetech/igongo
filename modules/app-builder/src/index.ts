/**
 * App Layout & Navigation (module 3) of the Igongo API: per-role menus,
 * tabs and home tiles, with history, public screens and client view rules.
 * The gateway imports only this file.
 */

export type { LayoutDeps } from "./application/layout-deps";
export { DEFAULT_LAYOUT_SETTINGS, type LayoutSettings } from "./domain/layout-settings";
export type { MyLayout } from "./domain/my-layout";
export { resolveLayout } from "./domain/resolve-layout";
export type { RoleLayout } from "./domain/role-layout";
export { SettingsLayoutStore } from "./infrastructure/db/settings-layout-store";
export { layoutRouter } from "./presentation/layout-router";
export { LAYOUT_PERMISSIONS } from "./presentation/permissions";
