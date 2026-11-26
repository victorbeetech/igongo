/** Everything Food Ordering's use cases need, given by the gateway per request. */

import type { DeliveryDesk } from "@igongo/contracts/delivery-riders";
import type { MenuReader } from "@igongo/contracts/menu-catalogue";
import type { ChangeContext } from "@igongo/core";
import type { OrderRepository } from "./ports/order-repository";
import type { RulesStore } from "./ports/rules-store";

export interface OrderingDeps {
  orders: OrderRepository;
  rules: RulesStore;
  /** Menus & Catalogue, through its contract. */
  menu: MenuReader;
  /** Delivery & Riders, or null while that module is switched off. */
  delivery: DeliveryDesk | null;
  change: ChangeContext;
}
