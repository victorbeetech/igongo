/**
 * Points rewards of the Igongo API: points earned on paid orders and the
 * sign-up bonus, spent at checkout, expired on schedule, and set by the
 * super admin. The gateway imports only this file.
 */

export type { PointsDeps } from "./application/points-deps";
export type { PointsStore, PointsCommit } from "./application/ports/points-store";
export { DEFAULT_POINTS_RULES, pointsForSpend, valueOfPoints, expiryFor, type PointsRules } from "./domain/rules";
export { balanceOf, isUsable, spendOldestFirst, type PointsLot } from "./domain/points-lot";
export type { PointsEvent, PointsEventKind } from "./domain/points-event";
export { DrizzlePointsStore } from "./infrastructure/db/drizzle-points-store";
export { readRules, saveRules } from "./application/use-cases/rules";
export { walletFor, type Wallet } from "./application/use-cases/wallet";
export { earnForPurchase, grantSignupBonus } from "./application/use-cases/earn";
export { redeemPoints, type RedeemResult } from "./application/use-cases/redeem";
export { expireDue, type ExpiryResult } from "./application/use-cases/expire";
export { adjustPoints, type AdjustInput } from "./application/use-cases/adjust";
export { POINTS_PERMISSIONS } from "./presentation/permissions";
export { pointsRouter } from "./presentation/points-router";
export { pointsValue, reverseForOrder } from "./application/use-cases/checkout";
export { pointsDesk } from "./infrastructure/points-desk";
