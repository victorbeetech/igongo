/**
 * Use case: the super admin makes a guest account a staff account by
 * matching it to the person's staff record. This is the ONLY way a person
 * who signed up in the app becomes staff.
 *
 * Steps:
 * 1. The account exists, is a guest account and its email is verified
 *    (Google, Apple and Apple "Hide My Email" addresses are verified).
 * 2. The staff number finds an active record that has no account yet.
 * 3. The phone the person gives is the record's phone, and the names share a word.
 * 4. The account becomes staff, the record is linked (HR adds the staff base
 *    role), and it is recorded in the Audit Trail.
 */

import type { StaffRecordMatcher } from "@igongo/contracts/hr-records";
import { AppError, recordChange, type ChangeContext } from "@igongo/core";
import { namesMatch, phonesMatch } from "../../domain/staff-match";
import type { AccountStore } from "../ports/account-store";

export interface MatchInput {
  userId: string;
  staffNumber: string;
  /** The phone the person gives the super admin, checked against the record. */
  phone: string;
}

export async function matchStaffRecord(deps: { accounts: AccountStore; staffRecords: StaffRecordMatcher }, ctx: ChangeContext, input: MatchInput): Promise<{ staffId: string }> {
  // 1. The account.
  const account = await deps.accounts.get(input.userId);
  if (!account) throw new AppError("not_found", "Account not found.");
  if (account.kind === "staff") throw new AppError("conflict", "This account is already a staff account.");
  if (!account.emailVerified) throw new AppError("bad_request", "The person must verify their email in the app first.");
  // 2. The record.
  const record = await deps.staffRecords.byStaffNumber(input.staffNumber.trim().toUpperCase());
  if (!record) throw new AppError("not_found", "No staff record has this staff number.");
  if (record.status !== "active") throw new AppError("bad_request", "This staff record is not active.");
  if (record.userId) throw new AppError("conflict", "This staff record already has an account.");
  // 3. The checks, without saying which one failed (so nobody can guess records).
  if (!phonesMatch(input.phone, record.phone) || !namesMatch(account.name, record.name)) {
    throw new AppError("bad_request", "The name, phone and staff number do not match the staff record.");
  }
  // 4. Make it so, and record it.
  await deps.accounts.setKind(account.id, "staff");
  await deps.staffRecords.linkAccount(record.staffId, account.id);
  await recordChange(ctx, {
    action: "account.matched_to_staff",
    module: "users-login",
    recordType: "user",
    recordId: account.id,
    summary: `Matched ${account.name} to staff record ${record.staffNumber}`,
    changes: { kind: { old: "client", new: "staff" } },
  });
  return { staffId: record.staffId };
}
