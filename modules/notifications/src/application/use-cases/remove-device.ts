/** Use case: forget a push token at sign-out. */

import type { DeviceTokenRepository } from "../ports/device-token-repository";

/**
 * Deletes [token] if it belongs to [userId]. A person can never delete
 * someone else's token. Returns true if a token was deleted.
 */
export function removeDevice(repo: DeviceTokenRepository, userId: string, token: string): Promise<boolean> {
  return repo.removeForUser(token, userId);
}
