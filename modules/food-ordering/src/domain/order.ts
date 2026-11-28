/**
 * One food order (S62-13), of any type and from any channel. The lines and
 * prices are copied in when ordered, so later menu changes never change it.
 */

import type { DeliveryPlace, OrderStatus, OrderType } from "@igongo/contracts/food-ordering";
import type { OrderLine } from "./order-line";
import type { StatusChange } from "./status-change";

/** Where the order came from. */
export type OrderChannel = "app" | "staff";

export interface Order {
  id: string;
  /** Running number on the ticket; shown as F-0042. */
  seq: number;
  /** The guest's account (null for a phone or walk-in order with no account). */
  userId: string | null;
  customerName: string;
  customerPhone: string | null;
  outlet: string;
  type: OrderType;
  channel: OrderChannel;
  status: OrderStatus;
  lines: OrderLine[];
  notes: string | null;
  allergies: string | null;
  /** Table for dine-in, room for room service. */
  table: string | null;
  deliverTo: DeliveryPlace | null;
  subtotal: number;
  /** Shillings taken off by a promo or voucher code (0 without one). */
  discount: number;
  /** The promo or voucher code used, in capitals, or null. */
  promoCode: string | null;
  /** Points the guest spent on this order (0 for none). */
  pointsSpent: number;
  /** Shillings taken off by those points (0 for none). Taken off the total. */
  pointsDiscount: number;
  deliveryFee: number;
  /** The takeaway container fee charged (0 when free). */
  containerFee: number;
  /** subtotal - discount + deliveryFee + containerFee, worked out on the server only. */
  total: number;
  paid: number;
  /**
   * The time the guest asked for: arrival for a pre-order, or the wanted
   * time of a scheduled delivery, takeaway or room service order. Null for
   * "as soon as possible".
   */
  arriveAt: Date | null;
  /** When the food should be ready. */
  readyAt: Date;
  /** The staff member who took it (phone, walk-in or waiter order). */
  takenBy: string | null;
  /**
   * The key the app sent with "place order" (one per checkout). The same
   * key from the same person returns the same order, so a double tap never
   * orders twice.
   */
  requestKey: string | null;
  history: StatusChange[];
  createdAt: Date;
  updatedAt: Date;
}

/** The ticket number, such as `F-0042`. */
export const orderNumber = (seq: number) => `F-${String(seq).padStart(4, "0")}`;
