/** Accounts and their sessions, for the admin screens and the login checks. */

import type { AccountStatus } from "../../domain/account-status";
import type { AccountSummary, SessionSummary } from "../../domain/account-summary";

export interface AccountStore {
  /** Accounts matching [text] (name, email or phone), newest first. */
  search(query: { text?: string; status?: AccountStatus; kind?: "staff" | "client"; limit: number; offset: number }): Promise<{ items: AccountSummary[]; total: number }>;
  get(userId: string): Promise<AccountSummary | null>;
  setStatus(userId: string, status: AccountStatus): Promise<void>;
  setKind(userId: string, kind: "staff" | "client"): Promise<void>;
  /** Saves the profile photo as a data URL (null removes it). */
  setImage(userId: string, image: string | null): Promise<void>;
  sessionsOf(userId: string): Promise<SessionSummary[]>;
  /** Deletes one session of [userId]; false when there was none. */
  deleteSession(userId: string, sessionId: string): Promise<boolean>;
  /** Deletes every session of [userId] (or of everyone when null), except [keepSessionId]. Returns how many. */
  deleteSessions(userId: string | null, keepSessionId?: string): Promise<number>;
}
