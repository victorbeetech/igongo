/**
 * The access rules checked on every signed-in API request, after the
 * session is known. Pure function: the gateway gives it the facts and acts
 * on the answer.
 *
 * 1. The web portal is staff only: a staff account that holds a staff role
 *    given by the super admin. A guest account is refused there, so guests
 *    use the app. (Before the first set-up, the owner is let in.)
 * 2. A web sign-in for staff lasts at most `staffWebSessionHours`.
 * 3. The super admin, and staff in sensitive roles when the switch is on,
 *    must turn on 2-step before they can do anything but set it up.
 */

import { SUPER_ADMIN_ROLE_KEY } from "@igongo/contracts/roles-permissions";
import { canSignIn } from "./account-status";
import type { LoginPolicy } from "./login-policy";
import type { RequestSurface } from "./request-surface";

export interface RequestFacts {
  surface: RequestSurface;
  /** The API path, such as `/api/users/me`. */
  path: string;
  /** `status` is re-read on every request, so a suspended account loses an open session at once. */
  account: { kind: string; email: string; twoFactorEnabled: boolean; status: string };
  roleKeys: string[];
  /** True when the person holds at least one staff role. */
  hasStaffRole: boolean;
  sessionCreatedAt: Date;
  now: Date;
  /** True while nobody is super admin and this is the owner's email: the one-time set-up. */
  ownerSettingUp: boolean;
}

/** What to do: let it through, or refuse with a status and a code. */
export type GateVerdict = { allow: true } | { allow: false; status: 401 | 403; code: string; message: string; endSession: boolean };

/** Paths that stay open so a person can sign out, see who they are and set up 2-step. */
const OPEN_PREFIXES = ["/api/auth/", "/api/security/me/", "/api/setup/", "/api/public/"];
const OPEN_EXACT = ["/api/users/me", "/api/access/me", "/api/login-methods"];

/** True when [roleKeys] must use email, password and 2-step under [policy]. */
export function needsStrongSignIn(roleKeys: string[], policy: Pick<LoginPolicy, "twoFactorForSensitiveRoles" | "sensitiveRoleKeys">): boolean {
  if (roleKeys.includes(SUPER_ADMIN_ROLE_KEY)) return true;
  return policy.twoFactorForSensitiveRoles && roleKeys.some((k) => policy.sensitiveRoleKeys.includes(k));
}

export function requestGate(f: RequestFacts, policy: LoginPolicy): GateVerdict {
  const open = OPEN_EXACT.includes(f.path) || OPEN_PREFIXES.some((p) => f.path.startsWith(p));
  // 0. Revocation: a pending, locked or suspended account loses its open session on the next request.
  if (!canSignIn(f.account.status)) {
    return { allow: false, status: 401, code: "account_not_active", message: "This account is not active. Please contact the hotel.", endSession: true };
  }
  // 1. Guests never use the web portal (signing out still works).
  if (f.surface === "web" && f.account.kind !== "staff" && !f.ownerSettingUp && !f.path.startsWith("/api/auth/")) {
    return { allow: false, status: 403, code: "staff_only", message: "The web portal is for hotel staff. Guests use the Igongo app.", endSession: true };
  }
  if (f.surface === "web" && !f.hasStaffRole && !f.ownerSettingUp && !open) {
    return { allow: false, status: 403, code: "staff_role_required", message: "Your staff access is not set up yet. Ask the super admin to give you a role.", endSession: true };
  }
  // 2. Short web sessions for staff (shared gate and reception PCs).
  const ageHours = (f.now.getTime() - f.sessionCreatedAt.getTime()) / 3_600_000;
  if (f.surface === "web" && f.account.kind === "staff" && ageHours > policy.staffWebSessionHours) {
    return { allow: false, status: 401, code: "session_expired", message: "Your session has ended. Please sign in again.", endSession: true };
  }
  // 3. 2-step first, for the super admin and (when switched on) sensitive roles.
  if (!f.account.twoFactorEnabled && needsStrongSignIn(f.roleKeys, policy) && !open) {
    return { allow: false, status: 403, code: "two_factor_required", message: "Turn on 2-step sign-in with an authenticator app before you continue.", endSession: false };
  }
  return { allow: true };
}
