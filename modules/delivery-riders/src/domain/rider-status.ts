/** A rider's live status (S66-03): online or not, and where they last were. */

export interface RiderStatus {
  userId: string;
  name: string;
  online: boolean;
  lat: number | null;
  lng: number | null;
  locationAt: Date | null;
  updatedAt: Date;
}
