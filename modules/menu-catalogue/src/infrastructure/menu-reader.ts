/** Menus & Catalogue's `MenuReader` contract, for Food Ordering. */

import type { MenuReader } from "@igongo/contracts/menu-catalogue";
import type { ItemRepository } from "../application/ports/item-repository";
import type { MenuSettingsStore } from "../application/ports/menu-settings-store";
import { isAvailable } from "../domain/menu-item";

/** The reader, checking availability at [now]. */
export function menuReader(items: ItemRepository, settings: MenuSettingsStore, now: Date): MenuReader {
  return {
    items: async (ids) =>
      (await items.byIds(ids)).map((i) => ({ itemId: i.id, outlet: i.outlet, name: i.name, price: i.price, prepMinutes: i.prepMinutes, available: isAvailable(i, now), options: i.options })),
    outlet: async (key) => (await settings.read()).outlets.find((o) => o.key === key) ?? null,
  };
}
