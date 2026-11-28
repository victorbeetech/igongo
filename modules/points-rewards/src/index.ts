/**
 * Points rewards of the Igongo API. The gateway imports only this file; the
 * selling modules use the `PointsDesk` contract in packages/contracts.
 */

export type { PointsDeps } from "./application/points-deps";
export { DrizzlePointsStore } from "./infrastructure/db/drizzle-points-store";
export { pointsDesk } from "./infrastructure/points-desk";
export { pointsRouter } from "./presentation/points-router";
export { walletFor, type Wallet } from "./application/use-cases/wallet";
