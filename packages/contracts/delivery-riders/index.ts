/**
 * Public contract of Delivery & Riders (module 66): delivery fees for a
 * zone, and opening a delivery job when an order is ready. Food Ordering
 * uses this; it never reads the delivery tables.
 */

import type { OrderRef } from "../food-ordering";

/** A delivery zone's fee and travel time. */
export interface ZoneQuote {
  zone: string;
  name: string;
  /** Whole shillings, set by the super admin. */
  fee: number;
  minutes: number;
}

/** What Food Ordering may ask of Delivery & Riders. */
export interface DeliveryDesk {
  /** The fee and time for [zone], or null when the zone is unknown. */
  quote(zone: string): Promise<ZoneQuote | null>;
  /** Opens a delivery job for a ready delivery order (once per order). */
  open(order: OrderRef): Promise<void>;
}

/** Events this module emits. */
export const DELIVERY_EVENTS = {
  assigned: "delivery.assigned",
  pickedUp: "delivery.picked_up",
  delivered: "delivery.delivered",
  failed: "delivery.failed",
} as const;
