/**
 * Use cases for the admin account screens: lock, unlock, suspend or approve
 * an account, and sign out one session, all of a person's sessions, or
 * everyone (emergency). Every action is recorded.
 */

import { AppError, recordChange, type ChangeContext } from "@igongo/core";
import type { AccountStatus } from "../../domain/account-status";
import type { AccountStore } from "../ports/account-store";

/** Sets an account's status. Anything but `active` also signs it out everywhere. */
export async function setAccountStatus(accounts: AccountStore, ctx: ChangeContext, userId: string, status: AccountStatus): Promise<void> {
  const account = await accounts.get(userId);
  if (!account) throw new AppError("not_found", "Account not found.");
  if (userId === ctx.actorId && status !== "active") throw new AppError("bad_request", "You cannot lock your own account.");
  await accounts.setStatus(userId, status);
  if (status !== "active") await accounts.deleteSessions(userId);
  await recordChange(ctx, {
    action: status === "active" ? (account.status === "pending" ? "account.approved" : "account.unlocked") : "account.locked",
    module: "users-login",
    recordType: "user",
    recordId: userId,
    summary: `Set ${account.name}'s account to ${status}`,
    changes: { status: { old: account.status, new: status } },
  });
}

/** Signs out one session of a person (their own, or anyone's for an admin). */
export async function revokeSession(accounts: AccountStore, ctx: ChangeContext, userId: string, sessionId: string): Promise<void> {
  if (!(await accounts.deleteSession(userId, sessionId))) throw new AppError("not_found", "Session not found.");
  await recordChange(ctx, { action: "session.revoked", module: "users-login", recordType: "user", recordId: userId, summary: "Signed out one device" });
}

/** Signs out all of a person's sessions, keeping [keepSessionId] when it is the caller's own. */
export async function revokeAllSessions(accounts: AccountStore, ctx: ChangeContext, userId: string, keepSessionId?: string): Promise<number> {
  const count = await accounts.deleteSessions(userId, keepSessionId);
  await recordChange(ctx, { action: "session.revoked", module: "users-login", recordType: "user", recordId: userId, summary: `Signed out ${count} devices` });
  return count;
}

/** Emergency: signs out everyone except the caller's own session. */
export async function signOutEveryone(accounts: AccountStore, ctx: ChangeContext, keepSessionId: string): Promise<number> {
  // Record first: an emergency action must never go unrecorded.
  await recordChange(ctx, { action: "session.revoked_all", module: "users-login", summary: "Emergency: signed everyone out" });
  return accounts.deleteSessions(null, keepSessionId);
}
