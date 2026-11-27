/**
 * Use case: may this person start a session with this method? Called by the
 * Better Auth hook just before every new session is saved, whatever the
 * method, so no path can skip it.
 *
 * Checks, in order:
 * 1. The account is active (not pending, locked or suspended).
 * 2. The method is switched on for the whole system.
 * 3. On the web portal, the account is a staff account (guests use the
 *    app) and holds at least one staff role, given by the super admin. The
 *    owner is let in once, for the first set-up.
 * 4. The method is allowed for at least one of the person's roles.
 * 5. The super admin (and sensitive roles when the switch is on) with 2-step
 *    turned on signs in only with email and password, so 2-step is never skipped.
 * 6. Google and Apple never start a session on the web portal (the app only).
 * 7. Google and Apple never start a session for the super admin, whatever the
 *    switches say and whether or not 2-step is on. Checked before the method
 *    is looked at, so a social callback whose method cannot be read is refused too.
 */

import type { LoginMethod } from "@igongo/contracts/users-login";
import { SUPER_ADMIN_ROLE_KEY, type AccessReader } from "@igongo/contracts/roles-permissions";
import { AppError } from "@igongo/core";
import { canSignIn } from "../../domain/account-status";
import { methodAllowedFor } from "../../domain/login-method-setting";
import { needsStrongSignIn } from "../../domain/request-gate";
import type { RequestSurface } from "../../domain/request-surface";
import type { AccountStore } from "../ports/account-store";
import type { LoginSettingsStore } from "../ports/login-settings-store";
import { isOwnerSettingUp } from "./claim-first-super-admin";

/** How the session is being started. `social` is true for a Google or Apple redirect or callback. */
export interface SessionStartVia {
  social: boolean;
}

export interface SessionStartDeps {
  settings: LoginSettingsStore;
  accounts: AccountStore;
  access: AccessReader;
  bootstrapEmail: string | undefined;
}

/** @throws AppError `permission_denied` (account not active) or `method_disabled` */
export async function checkSessionStart(
  deps: SessionStartDeps,
  userId: string,
  method: LoginMethod | null,
  surface: RequestSurface,
  via: SessionStartVia = { social: false },
): Promise<void> {
  const account = await deps.accounts.get(userId);
  if (!account || !canSignIn(account.status)) {
    throw new AppError("permission_denied", account?.status === "pending" ? "Your account is waiting for approval." : "This account is locked. Please contact the hotel.");
  }
  const profile = await deps.access.profileFor(userId);
  const roleKeys = profile.roles.map((r) => r.key);
  // 3. The web portal is for staff with a staff role given by the super admin.
  if (surface === "web" && !(await isOwnerSettingUp(deps, account.email))) {
    if (account.kind !== "staff") throw new AppError("permission_denied", "The web portal is for hotel staff. Guests sign in in the Igongo app.");
    if (!profile.roles.some((r) => r.isStaff)) throw new AppError("permission_denied", "Your staff access is not set up yet. Ask the super admin to give you a role.");
  }
  // Step 6: Google and Apple are for the app only, never the web portal.
  if (via.social && surface === "web") {
    throw new AppError("method_disabled", "Google and Apple sign-in is in the Igongo app only. Use your email and password on the web.");
  }
  // Step 7: the super admin never starts a session through Google or Apple.
  if (via.social && roleKeys.includes(SUPER_ADMIN_ROLE_KEY)) {
    throw new AppError("method_disabled", "The super admin signs in with email and password only.");
  }
  // Steps without a method (such as the 2FA code) were checked when the method started.
  if (!method) return;
  const setting = await deps.settings.method(method);
  if (!methodAllowedFor(setting, roleKeys)) throw new AppError("method_disabled", "This sign-in method is not available for your account.");
  // 5. Strong sign-in: no way around 2-step once it is on.
  if (method !== "email_password" && account.twoFactorEnabled && needsStrongSignIn(roleKeys, await deps.settings.policy())) {
    throw new AppError("method_disabled", "Your role signs in with email, password and your 2-step code.");
  }
}
