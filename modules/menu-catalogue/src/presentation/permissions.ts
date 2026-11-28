/** Permission keys Menus & Catalogue checks. The super admin gives them to roles. */

export const MENU_PERMISSIONS = {
  /** See hidden and switched-off items too (staff). Guests see the public menu without it. */
  view: "menu-catalogue.items.view",
  create: "menu-catalogue.items.create",
  edit: "menu-catalogue.items.edit",
  /** The kitchen's out-of-stock switch; the kitchen display's edit permission works too. */
  stock: "menu-catalogue.stock.edit",
  kitchen: "kitchen-display.tickets.edit",
  /** Change the outlets list. The routes also require the Super Admin role (see requireSuperAdmin). */
  settings: "menu-catalogue.settings.edit",
} as const;
