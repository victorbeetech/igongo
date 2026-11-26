// A delivery job and a rider's status, as the Delivery API returns them (modules/delivery-riders).

export type JobStatus = "waiting" | "assigned" | "accepted" | "picked_up" | "delivered" | "failed";

/** What is delivered. Food comes from Food Ordering; the rest the dispatcher sends by hand. */
export type DeliverySource = "food" | "shop" | "laundry" | "room_service" | "parcel";

/** Words for each kind of delivery. */
export const SOURCE_WORDS: Record<DeliverySource, string> = { food: "Food", shop: "Shop items", laundry: "Laundry", room_service: "Room service tray", parcel: "Parcel" };

export interface DeliveryJob {
  id: string;
  source: DeliverySource;
  orderId: string;
  /** F-0042 for food, D-0007 for a delivery sent by hand. */
  orderNumber: string;
  /** What the rider carries, in words (null for food). */
  what: string | null;
  customerName: string;
  customerPhone: string | null;
  place: { label: string; zone: string | null; lat: number | null; lng: number | null };
  fee: number;
  minutes: number;
  cashToCollect: number;
  status: JobStatus;
  riderUserId: string | null;
  riderName: string | null;
  cashCollected: number;
  cashHandedIn: boolean;
  failReason: string | null;
  openedAt: string;
  finishedAt: string | null;
}
