/**
 * Use cases for PIN sign-in on a trusted device. A signed-in person sets a
 * PIN for the device they are on; later they sign in on that device with
 * the PIN alone. Five wrong PINs lock the PIN for 15 minutes.
 */

import { AppError, hashPassword, verifyPassword } from "@igongo/core";
import type { PinStore } from "../ports/pin-store";

const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;

/** Saves a 4 to 8 digit PIN for [userId] on [deviceId]. */
export async function setPin(pins: PinStore, userId: string, deviceId: string, pin: string): Promise<void> {
  if (!/^\d{4,8}$/.test(pin)) throw new AppError("bad_request", "A PIN is 4 to 8 digits.");
  if (/^(\d)\1+$/.test(pin) || "0123456789".includes(pin)) throw new AppError("bad_request", "Choose a PIN that is harder to guess.");
  await pins.save(userId, deviceId, await hashPassword(pin));
}

/** @throws AppError `sign_in_required` for a wrong PIN, `rate_limited` while locked */
export async function verifyPin(pins: PinStore, userId: string, deviceId: string, pin: string, now: Date): Promise<void> {
  const stored = await pins.get(userId, deviceId);
  if (!stored) throw new AppError("sign_in_required", "No PIN is set for this device. Sign in another way first.");
  if (stored.lockedUntil && stored.lockedUntil > now) throw new AppError("rate_limited", "Too many wrong PINs. Try again later.");
  if (await verifyPassword(stored.pinHash, pin)) {
    await pins.clearFailures(userId, deviceId);
    return;
  }
  // Wrong PIN: count it, and lock after too many.
  const lock = stored.failedCount + 1 >= MAX_FAILURES ? new Date(now.getTime() + LOCK_MINUTES * 60_000) : null;
  await pins.recordFailure(userId, deviceId, lock);
  throw new AppError("sign_in_required", "Wrong PIN.");
}
