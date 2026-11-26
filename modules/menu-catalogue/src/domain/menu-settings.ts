/** The super admin's menu options (S61-01): the outlets that sell food. */

import type { OutletRef } from "@igongo/contracts/menu-catalogue";

export interface MenuSettings {
  outlets: OutletRef[];
  /** Which outlets show in the client view. */
  clientOutlets: string[];
}

/** Starts empty: the hotel names its own outlets. */
export const DEFAULT_MENU_SETTINGS: MenuSettings = { outlets: [], clientOutlets: [] };
