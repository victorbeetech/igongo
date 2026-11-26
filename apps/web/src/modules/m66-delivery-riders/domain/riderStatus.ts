// A rider's live status, as the Delivery API returns it.

export interface RiderStatus {
  userId: string;
  name: string;
  online: boolean;
  lat: number | null;
  lng: number | null;
  locationAt: string | null;
}
