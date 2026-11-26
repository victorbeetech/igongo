// A delivery job and a rider's status, as the Delivery API returns them (modules/delivery-riders).

export type JobStatus = "waiting" | "assigned" | "accepted" | "picked_up" | "delivered" | "failed";

export interface DeliveryJob {
  id: string;
  orderId: string;
  orderNumber: string;
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
