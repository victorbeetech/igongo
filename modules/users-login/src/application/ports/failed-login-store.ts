/** Counts wrong passwords per email, for the lockout rule. */

export interface FailedLoginStore {
  /** Until when [email] is locked, or null. */
  lockedUntil(email: string): Promise<Date | null>;
  /** Adds one wrong try; returns the count in a row. */
  addFailure(email: string): Promise<number>;
  /** Locks [email] until [until] and starts the count again. */
  lock(email: string, until: Date): Promise<void>;
  /** Forgets the tries after a good sign-in or an unlock. */
  clear(email: string): Promise<void>;
}
