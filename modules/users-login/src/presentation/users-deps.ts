/** What the Users & Login routes need, built per request by the gateway. */

import type { AccessReader, RoleAssigner } from "@igongo/contracts/roles-permissions";
import type { ChangeContext } from "@igongo/core";
import type { AccountStore } from "../application/ports/account-store";
import type { LoginSettingsStore } from "../application/ports/login-settings-store";
import type { Auth } from "../infrastructure/auth/create-auth";

export interface UsersDeps {
  accounts: AccountStore;
  settings: LoginSettingsStore;
  access: AccessReader & RoleAssigner;
  change: ChangeContext;
  /** The Better Auth instance, built on first use. */
  auth: () => Promise<Auth>;
  /** The owner's email for the one-time set-up (Worker secret). */
  bootstrapEmail: string | undefined;
}
