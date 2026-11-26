/**
 * Use case: everything the Users & Login module holds about the caller, for
 * the "Download my data" button (Data Protection and Privacy Act 2019,
 * right of access). Never includes password hashes, tokens or 2-step secrets.
 */

import type { AccountSummary, SessionSummary } from "../../domain/account-summary";
import type { AccountStore } from "../ports/account-store";

export interface MyData {
  exportedAt: string;
  account: AccountSummary;
  signedInDevices: SessionSummary[];
}

export async function exportMyData(accounts: AccountStore, userId: string, now: Date): Promise<MyData | null> {
  const account = await accounts.get(userId);
  if (!account) return null;
  return { exportedAt: now.toISOString(), account, signedInDevices: await accounts.sessionsOf(userId) };
}
