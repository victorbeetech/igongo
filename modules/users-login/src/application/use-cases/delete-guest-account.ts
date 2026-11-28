/**
 * Use case: the super admin deletes a guest account (never a staff account,
 * and never the admin's own). Staff accounts hold HR and payroll history, so
 * HR closes those instead. The deletion goes through Better Auth's internal
 * adapter, which runs the same user-delete hook as a self-delete: it removes
 * the person's roles and records the deletion in the Audit Trail. This use
 * case then records who did it, so the admin's name is on the record too.
 */

import { AppError, recordChange, type ChangeContext } from "@igongo/core";
import type { AccountStore } from "../ports/account-store";

/** The one Better Auth call this use case needs (the internal adapter's user delete). */
export interface GuestDeleter {
  deleteUser(userId: string): Promise<void>;
}

/** Deletes guest account [userId] on behalf of the admin in [ctx]. Throws AppError when it is not allowed. */
export async function deleteGuestAccount(accounts: AccountStore, deleter: GuestDeleter, ctx: ChangeContext, userId: string): Promise<void> {
  // Step 1: the account must exist.
  const account = await accounts.get(userId);
  if (!account) throw new AppError("not_found", "Account not found.");
  // Step 2: an admin cannot delete their own account from the admin screens.
  if (userId === ctx.actorId) throw new AppError("bad_request", "You cannot delete your own account here. Use Delete Account in your profile.");
  // Step 3: only guest accounts can be deleted here; HR closes staff accounts.
  if (account.kind !== "client") throw new AppError("permission_denied", "Staff accounts are closed by HR, not deleted here.");
  // Step 4: delete the person's sessions, sign-ins and account (runs the user-delete hook).
  await deleter.deleteUser(userId);
  // Step 5: record who deleted it, in the Audit Trail.
  await recordChange(ctx, {
    action: "account.deleted_by_admin",
    module: "users-login",
    recordType: "user",
    recordId: userId,
    summary: `Deleted the guest account of ${account.name}`,
  });
}
