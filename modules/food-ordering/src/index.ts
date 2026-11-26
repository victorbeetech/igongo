/**
 * Food Ordering (module 62) of the Igongo API. The gateway imports only
 * this file. See modules/food-ordering/README.md.
 */

export type { OrderingDeps } from "./application/ordering-deps";
export { orderNumber, type Order } from "./domain/order";
export { DEFAULT_ORDERING_RULES, type OrderingRules } from "./domain/ordering-rules";
export { DrizzleOrderRepository } from "./infrastructure/db/drizzle-order-repository";
export { SettingsRulesStore } from "./infrastructure/db/settings-rules-store";
export { orderPayable } from "./infrastructure/order-payable";
export { orderTracker } from "./infrastructure/order-tracker";
export { ORDER_PERMISSIONS } from "./presentation/permissions";
export { ordersRouter } from "./presentation/orders-router";
export { orderKpis } from "./infrastructure/order-kpis";
