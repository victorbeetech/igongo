/**
 * Use cases for the lockout rule: after `maxFailedAttempts` wrong passwords
 * in a row, the email is locked for `lockoutMinutes`, whoever is trying.
 * A good sign-in starts the count again.
 */

import { AppError } from "@igongo/core";
import type { LoginPolicy } from "../../domain/login-policy";
import type { FailedLoginStore } from "../ports/failed-login-store";

/** @throws AppError `rate_limited` while [email] is locked */
export async function refuseIfLocked(store: FailedLoginStore, email: string, now: Date): Promise<void> {
  const until = await store.lockedUntil(email);
  if (until && until > now) {
    const minutes = Math.ceil((until.getTime() - now.getTime()) / 60_000);
    throw new AppError("rate_limited", `Too many wrong passwords. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}, or reset your password.`);
  }
}

/** Counts one wrong password. Returns true when this try locked the email. */
export async function countFailure(store: FailedLoginStore, policy: Pick<LoginPolicy, "maxFailedAttempts" | "lockoutMinutes">, email: string, now: Date): Promise<boolean> {
  const inARow = await store.addFailure(email);
  if (inARow < policy.maxFailedAttempts) return false;
  await store.lock(email, new Date(now.getTime() + policy.lockoutMinutes * 60_000));
  return true;
}
