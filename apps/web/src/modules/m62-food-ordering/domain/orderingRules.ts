// The ordering rules (S62-16), as the API returns them.

import type { OrderType } from "./order";

export interface OrderingRules {
  types: Record<OrderType, { enabled: boolean; outlets: string[]; payment: "before" | "deposit" | "later" }>;
  preorderMinNoticeMinutes: number;
  depositPercent: number;
  cancelWindowMinutes: number;
  minutesPerQueuedOrder: number;
  /** How many days ahead guests may schedule delivery, takeaway or room service (0: off). */
  scheduleAheadDays: number;
  /** Takeaway container fee in shillings (0: containers are free). */
  containerFee: number;
  /** Loyalty points per 1,000 UGX of delivered food (0: points are off). */
  pointsPer1000: number;
}
