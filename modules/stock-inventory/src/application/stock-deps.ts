/** Everything stock's use cases need, given by the gateway per request. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { ItemRepository } from "./ports/item-repository";
import type { MovementRepository } from "./ports/movement-repository";
import type { StockSettingsStore } from "./ports/stock-settings-store";
import type { StoreRepository } from "./ports/store-repository";

export interface StockDeps {
  stores: StoreRepository;
  items: ItemRepository;
  movements: MovementRepository;
  settings: StockSettingsStore;
  /** Finds the caller's staff record, for store-keeper and department scopes; null while HR is off. */
  staff: StaffDirectory | null;
  change: ChangeContext;
}
