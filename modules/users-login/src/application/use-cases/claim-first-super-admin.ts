/**
 * Use case: the one-time set-up of the first super admin, with no password
 * anywhere in the code.
 *
 * How it works: the owner's email is a Cloudflare secret
 * (`BOOTSTRAP_ADMIN_EMAIL`). While nobody holds the Super Admin role, a
 * signed-in person whose VERIFIED email (Google or Apple confirm it) equals
 * that secret may claim the role, once. After that the route always refuses,
 * and every later super admin is given the role by an existing one.
 */

import { SUPER_ADMIN_ROLE_KEY, type AccessReader, type RoleAssigner } from "@igongo/contracts/roles-permissions";
import { AppError } from "@igongo/core";
import type { AccountStore } from "../ports/account-store";

export interface ClaimDeps {
  accounts: AccountStore;
  access: AccessReader & RoleAssigner;
  /** The owner's email from the Worker secret, or undefined when not set. */
  bootstrapEmail: string | undefined;
}

/** True while the set-up can still be done. */
export async function setupNeeded(deps: { access: AccessReader }): Promise<boolean> {
  return !(await deps.access.anyoneHolds(SUPER_ADMIN_ROLE_KEY));
}

/**
 * True while the set-up is still open and [email] is the owner's. Lets the
 * owner create the first account on the web portal and claim the role;
 * nobody else can sign up or in there before they are staff.
 */
export async function isOwnerSettingUp(deps: { access: AccessReader; bootstrapEmail: string | undefined }, email: string): Promise<boolean> {
  const owner = deps.bootstrapEmail?.trim().toLowerCase();
  return !!owner && email.trim().toLowerCase() === owner && (await setupNeeded(deps));
}

/** @throws AppError `conflict` once done, `permission_denied` for anyone but the owner */
export async function claimFirstSuperAdmin(deps: ClaimDeps, userId: string): Promise<void> {
  // 1. Only once, ever.
  if (!(await setupNeeded(deps))) throw new AppError("conflict", "The first super admin is already set up.");
  // 2. Only the owner, with an email the provider has verified.
  const account = await deps.accounts.get(userId);
  const owner = deps.bootstrapEmail?.trim().toLowerCase();
  if (!owner || !account?.emailVerified || account.email.toLowerCase() !== owner) {
    throw new AppError("permission_denied", "Only the system owner can do the first set-up. Sign in with the owner's Google account.");
  }
  // 3. Make them staff and give the role (the role change is recorded by Roles & Permissions).
  await deps.accounts.setKind(userId, "staff");
  await deps.access.assignByKey({ userId, roleKey: SUPER_ADMIN_ROLE_KEY, assignedBy: userId });
}
