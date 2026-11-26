// One booking, as the API returns it (packages/bookings-kit).

export type BookingStatus = "requested" | "awaiting_payment" | "confirmed" | "checked_in" | "cancelled";

export interface Booking {
  id: string;
  code: string;
  /** The text in the ticket's QR code. */
  qr: string;
  offeringId: string;
  offeringName: string;
  guestName: string;
  guestPhone: string | null;
  date: string | null;
  endDate: string | null;
  slot: string | null;
  units: number;
  total: number;
  paid: number;
  status: BookingStatus;
  notes: string | null;
  cancelReason: string | null;
  checkedInAt: string | null;
  createdAt: string;
}
