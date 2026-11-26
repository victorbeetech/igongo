/** Food Ordering as a `Payable`, so Payments can take money for orders. */

import type { Payable } from "@igongo/contracts/payments";
import type { OrderingDeps } from "../application/ordering-deps";
import { recordOrderPayment } from "../application/use-cases/change-order";
import { orderNumber } from "../domain/order";
import { paidBeforeKitchen } from "../domain/ordering-rules";

export function orderPayable(deps: OrderingDeps): Payable {
  return {
    async bill(orderId) {
      const o = await deps.orders.byId(orderId);
      if (!o || o.status === "cancelled") return null;
      // While waiting, the least is what the kitchen needs before it starts.
      const needed = o.status === "awaiting_payment" ? paidBeforeKitchen(await deps.rules.read(), o.type, o.total) : 0;
      return { label: `Order ${orderNumber(o.seq)}`, total: o.total, paid: o.paid, minimumNow: Math.max(0, needed - o.paid), payerUserId: o.userId, outlet: o.outlet };
    },
    paid: (orderId, amount) => recordOrderPayment(deps, orderId, amount),
  };
}
