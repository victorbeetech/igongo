/** Account states, and which ones may sign in. */

export const ACCOUNT_STATUSES = ["active", "pending", "locked", "suspended"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

/** Only active accounts can start a session. */
export function canSignIn(status: string): boolean {
  return status === "active";
}
