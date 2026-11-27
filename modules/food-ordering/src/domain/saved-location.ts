/**
 * A guest's saved delivery pin: the place they last chose on the map, kept
 * on the server so checkout starts from it. One per guest. The guest's own
 * user ID is the only key, so nobody else can read or change it.
 */

/** The pin a guest saved, ready to use as the delivery place of a cart. */
export interface SavedLocation {
  /** The words the rider reads, such as "Cottage 4" or "Plot 12, Kakoba". */
  label: string;
  /** The delivery zone key (fees and times come from Delivery & Riders), or null. */
  zone: string | null;
  /** Latitude of the pin, in degrees. */
  lat: number;
  /** Longitude of the pin, in degrees. */
  lng: number;
  /** When the guest last saved the pin. */
  updatedAt: Date;
}
