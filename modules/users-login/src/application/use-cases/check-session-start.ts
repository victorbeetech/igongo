/**
 * Use case: may this person start a session with this method? Called by the
 * Better Auth hook just before every new session is saved, whatever the
 * method, so no path can skip it.
 *
 * Checks, in order:
 * 1. The account is active (not pending, locked or suspended).
 * 2. The method is switched on for the whole system.
 * 3. The method is allowed for at least one of the person's roles.
 */

import type { LoginMethod } from "@igongo/contracts/users-login";
import type { AccessReader } from "@igongo/contracts/roles-permissions";
import { AppError } from "@igongo/core";
import { canSignIn } from "../../domain/account-status";
import { methodAllowedFor } from "../../domain/login-method-setting";
import type { AccountStore } from "../ports/account-store";
import type { LoginSettingsStore } from "../ports/login-settings-store";

export interface SessionStartDeps {
  settings: LoginSettingsStore;
  accounts: AccountStore;
  access: AccessReader;
}

/** @throws AppError `permission_denied` (account not active) or `method_disabled` */
export async function checkSessionStart(deps: SessionStartDeps, userId: string, method: LoginMethod | null): Promise<void> {
  const account = await deps.accounts.get(userId);
  if (!account || !canSignIn(account.status)) {
    throw new AppError("permission_denied", account?.status === "pending" ? "Your account is waiting for approval." : "This account is locked. Please contact the hotel.");
  }
  // Steps without a method (such as the 2FA code) were checked at step one.
  if (!method) return;
  const setting = await deps.settings.method(method);
  const roleKeys = (await deps.access.profileFor(userId)).roles.map((r) => r.key);
  if (!methodAllowedFor(setting, roleKeys)) throw new AppError("method_disabled", "This sign-in method is not available for your account.");
}
