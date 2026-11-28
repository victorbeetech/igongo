/**
 * The points programme as Food Ordering (and any other selling module) sees
 * it: the `PointsDesk` contract, built on the points use cases. The gateway
 * adds the module's own on/off switch on top of this (see guest-services).
 */

import type { PointsDesk } from "@igongo/contracts/points-rewards";
import type { PointsDeps } from "../application/points-deps";
import { earnForPurchase } from "../application/use-cases/earn";
import { redeemPoints } from "../application/use-cases/redeem";
import { pointsValue, reverseForOrder } from "../application/use-cases/checkout";

/** Builds the desk over [deps]. */
export function pointsDesk(deps: PointsDeps): PointsDesk {
  return {
    valueOf: (points) => pointsValue(deps, points),
    spend: async (guestId, points, orderRef) => (await redeemPoints(deps, { guestId, points, orderRef })).valueUgx,
    earn: (guestId, amountUgx, orderRef) => earnForPurchase(deps, { guestId, amountUgx, orderRef }),
    reverse: (guestId, orderRef) => reverseForOrder(deps, guestId, orderRef),
  };
}
