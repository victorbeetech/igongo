// A menu item, as the Menus API returns it (modules/menu-catalogue).
// Shared because the menu pages (61) and the food ordering pages (62) both show it.

import type { OptionGroup } from "./optionGroup";

export interface MenuItem {
  id: string;
  outlet: string;
  section: string;
  name: string;
  description: string | null;
  price: number;
  prepMinutes: number;
  options: OptionGroup[];
  tags: string[];
  allergens: string[];
  photoUrl: string | null;
  active: boolean;
  visibleToClients: boolean;
  /** On sale and not out of stock today. */
  available: boolean;
}
