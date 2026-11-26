/** One step in an order's timeline (S62-13): its new status, when, and who moved it. */

import type { OrderStatus } from "@igongo/contracts/food-ordering";

export interface StatusChange {
  status: OrderStatus;
  /** ISO time. */
  at: string;
  /** A user ID, or null for the system (a payment came in). */
  by: string | null;
  note: string | null;
}
