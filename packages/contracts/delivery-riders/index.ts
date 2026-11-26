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

/**
 * What is being delivered. Food is the first; the dispatcher can also send
 * shop items, laundry, room service trays and parcels, and other modules
 * can open their own deliveries the same way.
 */
export const DELIVERY_SOURCES = ["food", "shop", "laundry", "room_service", "parcel"] as const;
export type DeliverySource = (typeof DELIVERY_SOURCES)[number];

/** What Food Ordering may ask of Delivery & Riders. */
export interface DeliveryDesk {
  /** The fee and time for [zone], or null when the zone is unknown. */
  quote(zone: string): Promise<ZoneQuote | null>;
  /** Opens a delivery job for a ready delivery order (once per order). */
  open(order: OrderRef): Promise<void>;
}

/**
 * Moves a delivered thing on in the module it came from, when the rider
 * picks it up or hands it over. Food Ordering gives one for food; a source
 * without a tracker (a parcel) just lives in Delivery & Riders.
 */
export interface SourceTracker {
  advance(recordId: string, step: "on_the_way" | "delivered"): Promise<void>;
}

/** Events this module emits. */
export const DELIVERY_EVENTS = {
  assigned: "delivery.assigned",
  pickedUp: "delivery.picked_up",
  delivered: "delivery.delivered",
  failed: "delivery.failed",
} as const;
