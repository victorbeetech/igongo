/** Everything Food Ordering's use cases need, given by the gateway per request. */

import type { DeliveryDesk } from "@igongo/contracts/delivery-riders";
import type { MenuReader } from "@igongo/contracts/menu-catalogue";
import type { UserNotifier } from "@igongo/contracts/notifications";
import type { PromoDesk } from "@igongo/contracts/promotions-vouchers";
import type { ChangeContext } from "@igongo/core";
import type { CartRepository } from "./ports/cart-repository";
import type { OrderRepository } from "./ports/order-repository";
import type { RatingRepository } from "./ports/rating-repository";
import type { RulesStore } from "./ports/rules-store";

export interface OrderingDeps {
  orders: OrderRepository;
  /** Guests' saved carts (one per guest, each only their own). */
  carts: CartRepository;
  ratings: RatingRepository;
  rules: RulesStore;
  /** Menus & Catalogue, through its contract. */
  menu: MenuReader;
  /** Delivery & Riders, or null while that module is switched off. */
  delivery: DeliveryDesk | null;
  /** Promotions & Vouchers (promo and voucher codes), or null while that module is switched off. */
  promos: PromoDesk | null;
  /** Pushes order news to the guest's phone (Notifications); sends nothing when not set up. */
  notify: UserNotifier;
  change: ChangeContext;
}
