// A Google Maps directions link for a delivery: the pin when there is one,
// else the address words. Opens the Maps app on phones (no API key needed).

import type { DeliveryJob } from "./deliveryJob";

export function mapsLink(job: DeliveryJob): string {
  const to = job.place.lat !== null && job.place.lng !== null ? `${job.place.lat},${job.place.lng}` : `${job.place.label}, Mbarara`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(to)}`;
}
