/**
 * Delivery & Riders (module 66) of the Igongo API. The gateway imports
 * only this file. See modules/delivery-riders/README.md.
 */

export type { DeliveryDeps } from "./application/delivery-deps";
export type { DeliveryJob } from "./domain/delivery-job";
export { DEFAULT_DELIVERY_RULES, type DeliveryRules } from "./domain/delivery-rules";
export { DrizzleJobRepository } from "./infrastructure/db/drizzle-job-repository";
export { DrizzleRiderRepository } from "./infrastructure/db/drizzle-rider-repository";
export { SettingsDeliveryRulesStore } from "./infrastructure/db/settings-rules-store";
export { deliveryDesk } from "./infrastructure/delivery-desk";
export { DELIVERY_PERMISSIONS } from "./presentation/permissions";
export { deliveryRouter } from "./presentation/delivery-router";
