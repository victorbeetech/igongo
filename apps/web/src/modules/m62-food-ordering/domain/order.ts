// A food order, as the Food Ordering API returns it (modules/food-ordering).

export type OrderType = "delivery" | "room_service" | "dine_in" | "takeaway" | "pre_order";
export type OrderStatus = "awaiting_payment" | "received" | "preparing" | "ready" | "on_the_way" | "delivered" | "cancelled";

/** One line: item, how many, options and price. */
export interface OrderLine {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  options: { group: string; key: string; name: string; priceDelta: number }[];
  notes: string | null;
  lineTotal: number;
}

export interface Order {
  id: string;
  /** Such as F-0042. */
  number: string;
  customerName: string;
  outlet: string;
  type: OrderType;
  status: OrderStatus;
  lines: OrderLine[];
  notes: string | null;
  allergies: string | null;
  table: string | null;
  deliverTo: { label: string; zone: string | null } | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paid: number;
  arriveAt: string | null;
  readyAt: string;
  history: { status: OrderStatus; at: string; note: string | null }[];
  /** The statuses staff may set next. */
  next: OrderStatus[];
  createdAt: string;
}

/** Words for each order type. */
export const TYPE_WORDS: Record<OrderType, string> = { delivery: "Delivery", room_service: "Room service", dine_in: "Dine-in", takeaway: "Takeaway", pre_order: "Pre-order (I'm coming)" };
