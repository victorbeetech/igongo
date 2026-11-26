/**
 * Menus & Catalogue (module 61) of the Igongo API. The gateway imports
 * only this file. See modules/menu-catalogue/README.md.
 */

export type { MenuDeps } from "./application/menu-deps";
export { isAvailable, type MenuItem } from "./domain/menu-item";
export { DrizzleItemRepository } from "./infrastructure/db/drizzle-item-repository";
export { SettingsMenuStore } from "./infrastructure/db/settings-menu-store";
export { menuReader } from "./infrastructure/menu-reader";
export { MENU_PERMISSIONS } from "./presentation/permissions";
export { menuRouter } from "./presentation/menu-router";
