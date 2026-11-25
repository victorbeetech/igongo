/**
 * Use case: an admin creates a staff account. The account is active at once
 * and has no roles until they are given in Roles & Permissions. A password
 * is optional, because staff can also use Google, a PIN or their card.
 */

import { AppError, hashPassword, recordChange, type ChangeContext } from "@igongo/core";

/** The parts of Better Auth's internal adapter this use case calls. */
export interface AccountWriter {
  findUserByEmail(email: string): Promise<{ user: { id: string } } | null>;
  createUser(data: { name: string; email: string } & Record<string, unknown>, source: { method: "admin" }): Promise<{ id: string }>;
  linkAccount(data: { userId: string; providerId: string; accountId: string; password?: string }): Promise<unknown>;
}

export async function createStaffAccount(writer: AccountWriter, ctx: ChangeContext, input: { name: string; email: string; password?: string | undefined }): Promise<{ id: string }> {
  const email = input.email.toLowerCase();
  if (await writer.findUserByEmail(email)) throw new AppError("conflict", "An account with this email already exists.");
  // `kind: staff` tells the sign-up hook not to apply the client rules.
  const user = await writer.createUser({ name: input.name, email, emailVerified: false, kind: "staff", status: "active" }, { method: "admin" });
  if (input.password) await writer.linkAccount({ userId: user.id, providerId: "credential", accountId: user.id, password: await hashPassword(input.password) });
  await recordChange(ctx, { action: "account.created", module: "users-login", recordType: "user", recordId: user.id, summary: `Created a staff account for ${input.name}` });
  return { id: user.id };
}
