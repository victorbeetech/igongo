/**
 * Public contract of Food Ordering (module 62): orders as Delivery & Riders
 * sees them, and the only status changes another module may make.
 */

/** Every kind of order. Each can be switched on or off per outlet. */
export const ORDER_TYPES = ["delivery", "room_service", "dine_in", "takeaway", "pre_order"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

/** An order's life, in order. `cancelled` can happen before `on_the_way`. */
export const ORDER_STATUSES = ["awaiting_payment", "received", "preparing", "ready", "on_the_way", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Where a delivery goes. */
export interface DeliveryPlace {
  /** The words the rider reads, such as "Cottage 4" or "Plot 12, Kakoba". */
  label: string;
  /** The delivery zone key (fees and times come from Delivery & Riders). */
  zone: string | null;
  lat: number | null;
  lng: number | null;
}

/** An order as other modules see it. */
export interface OrderRef {
  orderId: string;
  /** The number on the ticket, such as `F-0042`. */
  number: string;
  userId: string | null;
  customerName: string;
  customerPhone: string | null;
  outlet: string;
  type: OrderType;
  status: OrderStatus;
  total: number;
  paid: number;
  deliverTo: DeliveryPlace | null;
}

/** Reads orders and moves deliveries on. Built by the gateway from Food Ordering. */
export interface OrderTracker {
  byId(orderId: string): Promise<OrderRef | null>;
  /** The rider picked the order up, or handed it over. */
  advance(orderId: string, status: "on_the_way" | "delivered"): Promise<void>;
}

/** Events this module emits. */
export const ORDER_EVENTS = {
  placed: "order.placed",
  ready: "order.ready",
  completed: "order.completed",
  cancelled: "order.cancelled",
} as const;
