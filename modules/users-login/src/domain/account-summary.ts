/** An account and a session as the admin screens show them. Never holds secrets. */

import type { AccountStatus } from "./account-status";

export interface AccountSummary {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  image: string | null;
  status: AccountStatus;
  kind: "staff" | "client";
  twoFactorEnabled: boolean;
  createdAt: Date;
  /** Sign-in methods linked to the account, such as `credential` or `google`. */
  providers: string[];
}

export interface SessionSummary {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}
