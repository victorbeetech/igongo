/**
 * Food Ordering (module 62) of the Igongo API. The gateway imports only
 * this file. See modules/food-ordering/README.md.
 */

export type { OrderingDeps } from "./application/ordering-deps";
export { orderNumber, type Order } from "./domain/order";
export { DEFAULT_ORDERING_RULES, type OrderingRules } from "./domain/ordering-rules";
export { DrizzleOrderRepository } from "./infrastructure/db/drizzle-order-repository";
export { DrizzleCartRepository } from "./infrastructure/db/drizzle-cart-repository";
export { DrizzleLocationRepository } from "./infrastructure/db/drizzle-location-repository";
export { DrizzleRatingRepository } from "./infrastructure/db/drizzle-rating-repository";
export { SettingsRulesStore } from "./infrastructure/db/settings-rules-store";
export { orderPayable } from "./infrastructure/order-payable";
export { orderTracker } from "./infrastructure/order-tracker";
export { ORDER_PERMISSIONS } from "./presentation/permissions";
export { ordersRouter } from "./presentation/orders-router";
export { readSavedCart, saveCart, clearSavedCart } from "./application/use-cases/guest-cart";
export type { CartRepository } from "./application/ports/cart-repository";
export type { LocationRepository } from "./application/ports/location-repository";
export type { SavedLocation } from "./domain/saved-location";
export { readSavedLocation, saveLocation, clearSavedLocation } from "./application/use-cases/guest-location";
export type { SavedCart, SavedCartLine } from "./domain/saved-cart";
export { orderKpis } from "./infrastructure/order-kpis";
export { foodSummary, type FoodSummary } from "./application/use-cases/guest-summary";
