/** Records HR Records changes in the Audit Trail with the caller's details. */

import { recordChange, type ChangeContext } from "@igongo/core";

/** Records one HR action on a staff record. */
export function recordHrChange(ctx: ChangeContext, entry: { action: string; recordId: string; summary: string; changes?: Record<string, { old: unknown; new: unknown }> }): Promise<void> {
  return recordChange(ctx, { module: "hr-records", recordType: "staff", ...entry });
}
