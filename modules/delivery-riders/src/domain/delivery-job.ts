/**
 * One delivery (S66-01): a ready delivery order going to a guest, from the
 * moment the kitchen marks it ready until it is handed over (or fails).
 */

import type { DeliveryPlace } from "@igongo/contracts/food-ordering";

export const JOB_STATUSES = ["waiting", "assigned", "accepted", "picked_up", "delivered", "failed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface DeliveryJob {
  id: string;
  orderId: string;
  /** The ticket number, such as `F-0042`. */
  orderNumber: string;
  customerUserId: string | null;
  customerName: string;
  customerPhone: string | null;
  place: DeliveryPlace;
  /** The zone's fee and travel time when opened. */
  fee: number;
  minutes: number;
  /** What the rider must collect at the door (the order's unpaid balance). */
  cashToCollect: number;
  status: JobStatus;
  riderUserId: string | null;
  riderName: string | null;
  /** The 4-digit code the guest gives the rider as proof of delivery (S66-07). */
  code: string;
  cashCollected: number;
  /** True once the rider handed the cash in at the end of the shift (S66-08). */
  cashHandedIn: boolean;
  failReason: string | null;
  openedAt: Date;
  assignedAt: Date | null;
  pickedUpAt: Date | null;
  finishedAt: Date | null;
}

/** Jobs that are a rider's current work. */
export const ACTIVE_JOB_STATUSES: JobStatus[] = ["assigned", "accepted", "picked_up"];
