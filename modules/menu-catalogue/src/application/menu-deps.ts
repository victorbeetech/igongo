/** Everything Menus & Catalogue's use cases need, given by the gateway per request. */

import type { ChangeContext } from "@igongo/core";
import type { ItemRepository } from "./ports/item-repository";
import type { MenuSettingsStore } from "./ports/menu-settings-store";

export interface MenuDeps {
  items: ItemRepository;
  settings: MenuSettingsStore;
  change: ChangeContext;
}
