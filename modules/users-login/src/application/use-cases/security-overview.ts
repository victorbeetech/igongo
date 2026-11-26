/**
 * Use case: the top of the super admin's Security settings screen: who the
 * super admins are, and warnings that need action (no second super admin,
 * a super admin without 2-step).
 */

import { SUPER_ADMIN_ROLE_KEY, type AccessReader } from "@igongo/contracts/roles-permissions";
import type { LoginPolicy } from "../../domain/login-policy";
import type { AccountStore } from "../ports/account-store";
import type { LoginSettingsStore } from "../ports/login-settings-store";

export interface SecurityOverview {
  superAdmins: { id: string; name: string; email: string; twoFactorEnabled: boolean }[];
  warnings: string[];
  policy: LoginPolicy;
}

export async function securityOverview(deps: { accounts: AccountStore; access: AccessReader; settings: LoginSettingsStore }): Promise<SecurityOverview> {
  // 1. The super admins and their 2-step state.
  const ids = await deps.access.holdersOf([SUPER_ADMIN_ROLE_KEY]);
  const found = await Promise.all(ids.map((id) => deps.accounts.get(id)));
  const superAdmins = found.filter((a) => a !== null).map((a) => ({ id: a.id, name: a.name, email: a.email, twoFactorEnabled: a.twoFactorEnabled }));
  // 2. What needs doing.
  const warnings: string[] = [];
  if (superAdmins.length < 2) warnings.push("Add a second super admin, so the hotel is never locked out if one person is away or loses their phone.");
  for (const a of superAdmins.filter((s) => !s.twoFactorEnabled)) warnings.push(`${a.name} has not turned on 2-step sign-in yet.`);
  return { superAdmins, warnings, policy: await deps.settings.policy() };
}
