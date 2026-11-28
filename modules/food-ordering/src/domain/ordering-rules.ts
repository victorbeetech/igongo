/**
 * The super admin's ordering rules (S62-16), kept as data: which order
 * types are on at which outlets and how each is paid, pre-order notice,
 * deposit, cancel window, and kitchen load for ready times.
 */

import { ORDER_TYPES, type OrderType } from "@igongo/contracts/food-ordering";
import { recordOf } from "@igongo/core";

/** before: pay in full first. deposit: pay the deposit first. later: pay at the end (or on arrival). */
export type PaymentTiming = "before" | "deposit" | "later";

export interface OrderTypeRule {
  enabled: boolean;
  /** Outlets that take this type; empty means every outlet. */
  outlets: string[];
  payment: PaymentTiming;
}

export interface OrderingRules {
  types: Record<OrderType, OrderTypeRule>;
  /** The least notice a pre-order needs, in minutes. */
  preorderMinNoticeMinutes: number;
  /** The deposit, as a percent of the total, for `deposit` types. */
  depositPercent: number;
  /** How long a guest may cancel after ordering, in minutes. */
  cancelWindowMinutes: number;
  /** Minutes each order already in the kitchen adds to a ready time. */
  minutesPerQueuedOrder: number;
  /** How many days ahead a guest may schedule an order (0 turns scheduling off). */
  scheduleAheadDays: number;
  /** The takeaway container fee in shillings: 0 gives containers free; above 0 it is added to every takeaway order. */
  containerFee: number;
  /** Loyalty points per 1,000 shillings of delivered food (0 switches points off). */
  pointsPer1000: number;
}

const PAYMENT_BY_TYPE: Record<OrderType, PaymentTiming> = { delivery: "before", room_service: "later", dine_in: "later", takeaway: "before", pre_order: "deposit" };

/** Every type on everywhere; the hotel narrows it in settings. */
export const DEFAULT_ORDERING_RULES: OrderingRules = {
  types: recordOf(ORDER_TYPES, (t): OrderTypeRule => ({ enabled: true, outlets: [], payment: PAYMENT_BY_TYPE[t] })),
  preorderMinNoticeMinutes: 60,
  depositPercent: 50,
  cancelWindowMinutes: 5,
  minutesPerQueuedOrder: 3,
  scheduleAheadDays: 7,
  containerFee: 0,
  pointsPer1000: 0,
};

/** Order types a guest may schedule for later (pre-orders always have a time; dine-in guests give their arrival time). */
export const SCHEDULABLE_TYPES: readonly OrderType[] = ["delivery", "takeaway", "room_service", "dine_in"];

/** True when [type] can be ordered at [outlet]. */
export function typeAllowed(rules: OrderingRules, type: OrderType, outlet: string): boolean {
  const rule = rules.types[type];
  return !!rule?.enabled && (!rule.outlets.length || rule.outlets.includes(outlet));
}

/** What must be paid before the kitchen starts on an order of [type] costing [total]. */
export function paidBeforeKitchen(rules: OrderingRules, type: OrderType, total: number): number {
  const timing = rules.types[type]?.payment ?? "later";
  if (timing === "before") return total;
  if (timing === "deposit") return Math.ceil((total * rules.depositPercent) / 100);
  return 0;
}

/**
 * When the food will be ready: now plus the slowest item plus the kitchen's
 * queue; for a pre-order or scheduled order, at the guest's time less the
 * delivery's travel minutes (so it arrives on time).
 */
export function readyTime(input: { now: Date; prepMinutes: number[]; queued: number; arriveAt: Date | null; travelMinutes?: number; rules: OrderingRules }): Date {
  if (input.arriveAt) return new Date(input.arriveAt.getTime() - (input.travelMinutes ?? 0) * 60_000);
  const minutes = Math.max(0, ...input.prepMinutes) + input.queued * input.rules.minutesPerQueuedOrder;
  return new Date(input.now.getTime() + minutes * 60_000);
}
