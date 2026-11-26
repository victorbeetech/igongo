/**
 * Use case: may this person start a session with this method? Called by the
 * Better Auth hook just before every new session is saved, whatever the
 * method, so no path can skip it.
 *
 * Checks, in order:
 * 1. The account is active (not pending, locked or suspended).
 * 2. The method is switched on for the whole system.
 * 3. On the web portal, the account is a staff account (guests use the
 *    app). The owner is let in once, for the first set-up.
 * 4. The method is allowed for at least one of the person's roles.
 * 5. The super admin (and sensitive roles when the switch is on) with 2-step
 *    turned on signs in only with email and password, so 2-step is never skipped.
 */

import type { LoginMethod } from "@igongo/contracts/users-login";
import type { AccessReader } from "@igongo/contracts/roles-permissions";
import { AppError } from "@igongo/core";
import { canSignIn } from "../../domain/account-status";
import { methodAllowedFor } from "../../domain/login-method-setting";
import { needsStrongSignIn } from "../../domain/request-gate";
import type { RequestSurface } from "../../domain/request-surface";
import type { AccountStore } from "../ports/account-store";
import type { LoginSettingsStore } from "../ports/login-settings-store";
import { isOwnerSettingUp } from "./claim-first-super-admin";

export interface SessionStartDeps {
  settings: LoginSettingsStore;
  accounts: AccountStore;
  access: AccessReader;
  bootstrapEmail: string | undefined;
}

/** @throws AppError `permission_denied` (account not active) or `method_disabled` */
export async function checkSessionStart(deps: SessionStartDeps, userId: string, method: LoginMethod | null, surface: RequestSurface): Promise<void> {
  const account = await deps.accounts.get(userId);
  if (!account || !canSignIn(account.status)) {
    throw new AppError("permission_denied", account?.status === "pending" ? "Your account is waiting for approval." : "This account is locked. Please contact the hotel.");
  }
  // 3. The web portal is for staff.
  if (surface === "web" && account.kind !== "staff" && !(await isOwnerSettingUp(deps, account.email))) {
    throw new AppError("permission_denied", "The web portal is for hotel staff. Guests sign in in the Igongo app.");
  }
  // Steps without a method (such as the 2FA code) were checked when the method started.
  if (!method) return;
  const setting = await deps.settings.method(method);
  const roleKeys = (await deps.access.profileFor(userId)).roles.map((r) => r.key);
  if (!methodAllowedFor(setting, roleKeys)) throw new AppError("method_disabled", "This sign-in method is not available for your account.");
  // 5. Strong sign-in: no way around 2-step once it is on.
  if (method !== "email_password" && account.twoFactorEnabled && needsStrongSignIn(roleKeys, await deps.settings.policy())) {
    throw new AppError("method_disabled", "Your role signs in with email, password and your 2-step code.");
  }
}
