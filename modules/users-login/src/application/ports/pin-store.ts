/** PINs for trusted devices. */

export interface StoredPin {
  userId: string;
  deviceId: string;
  pinHash: string;
  failedCount: number;
  lockedUntil: Date | null;
}

export interface PinStore {
  get(userId: string, deviceId: string): Promise<StoredPin | null>;
  /** Saves a new PIN and clears failures. */
  save(userId: string, deviceId: string, pinHash: string): Promise<void>;
  /** Records a wrong PIN, locking the PIN until [lockUntil] when given. */
  recordFailure(userId: string, deviceId: string, lockUntil: Date | null): Promise<void>;
  clearFailures(userId: string, deviceId: string): Promise<void>;
}
