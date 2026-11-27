/**
 * Use cases for a guest's saved delivery pin: read it, save it, and remove
 * it. Each works only on the caller's own pin (the user ID comes from the
 * signed-in session, never from the request body or the URL).
 */

import type { OrderingDeps } from "../ordering-deps";
import type { SavedLocation } from "../../domain/saved-location";

/** The pin [userId] saved, or null when they have none. */
export async function readSavedLocation(deps: OrderingDeps, userId: string): Promise<SavedLocation | null> {
  // Step 1: ask the store for this guest's pin only.
  return deps.locations.read(userId);
}

/**
 * Saves the pin [input] for [userId], replacing any earlier one. The time
 * of saving comes from the server clock, not from the app.
 */
export async function saveLocation(deps: OrderingDeps, userId: string, input: Omit<SavedLocation, "updatedAt">): Promise<SavedLocation> {
  // Step 1: stamp the pin with the server's time.
  const location: SavedLocation = { label: input.label, zone: input.zone, lat: input.lat, lng: input.lng, updatedAt: deps.change.now };
  // Step 2: store it under this guest's own ID.
  await deps.locations.write(userId, location);
  return location;
}

/** Removes [userId]'s saved pin. */
export async function clearSavedLocation(deps: OrderingDeps, userId: string): Promise<void> {
  await deps.locations.clear(userId);
}
