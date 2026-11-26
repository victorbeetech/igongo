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
  deliveryFee: number;
  total: number;
  paid: number;
  /** When a pre-order guest arrives. */
  arriveAt: Date | null;
  /** When the food should be ready. */
  readyAt: Date;
  /** The staff member who took it (phone, walk-in or waiter order). */
  takenBy: string | null;
  history: StatusChange[];
  createdAt: Date;
  updatedAt: Date;
}

/** The ticket number, such as `F-0042`. */
export const orderNumber = (seq: number) => `F-${String(seq).padStart(4, "0")}`;
