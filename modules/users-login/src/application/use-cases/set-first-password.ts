/**
 * Use case: add email and password to an account that was made with Google
 * or Apple. The super admin needs it, because the console asks for email,
 * password and 2-step. Only with a fresh sign-in, only when there is no
 * password yet (changing one goes through Better Auth's change-password),
 * and it is recorded and the person is told.
 */

import { AppError, hashPassword, recordChange, type ChangeContext } from "@igongo/core";
import type { LoginPolicy } from "../../domain/login-policy";
import { passwordProblem } from "../../domain/password-rules";
import type { AccountStore } from "../ports/account-store";
import type { SecurityAlerts } from "../ports/security-alerts";

/** The part of Better Auth's internal adapter this needs. */
export interface CredentialWriter {
  linkAccount(data: { userId: string; providerId: string; accountId: string; password: string }): Promise<unknown>;
}

export interface FirstPasswordDeps {
  accounts: AccountStore;
  writer: CredentialWriter;
  alerts: SecurityAlerts;
  policy: LoginPolicy;
}

/** @throws AppError `permission_denied` for an old session, `conflict` when a password exists, `bad_request` for a weak one */
export async function setFirstPassword(deps: FirstPasswordDeps, ctx: ChangeContext, me: { userId: string; sessionCreatedAt: Date }, newPassword: string, freshSeconds: number): Promise<void> {
  // 1. A recent sign-in, so a forgotten open session cannot add a password.
  if (ctx.now.getTime() - me.sessionCreatedAt.getTime() > freshSeconds * 1000) throw new AppError("permission_denied", "For your safety, sign in again first.");
  // 2. Only when there is no password yet.
  const account = await deps.accounts.get(me.userId);
  if (!account) throw new AppError("not_found", "Account not found.");
  if (account.providers.includes("credential")) throw new AppError("conflict", "This account already has a password. Use Change password.");
  // 3. The same rules as everywhere else.
  const problem = passwordProblem(newPassword, deps.policy);
  if (problem) throw new AppError("bad_request", problem);
  // 4. Save it, record it, tell the person.
  await deps.writer.linkAccount({ userId: account.id, providerId: "credential", accountId: account.id, password: await hashPassword(newPassword) });
  await recordChange(ctx, { action: "login_method.linked", module: "users-login", recordType: "user", recordId: account.id, summary: "Added email and password sign-in" });
  await deps.alerts.toPerson({ userId: account.id, email: account.email }, "Email and password sign-in was added to your Igongo account. If this was not you, contact the hotel.");
}
