/**
 * Records Roles & Permissions changes in the Audit Trail, using the shared
 * change context from @igongo/core.
 */

import { recordChange, type ChangeContext } from "@igongo/core";

export type { ChangeContext };

/** Records one Roles & Permissions action with the caller's details. */
export function recordRoleChange(
  ctx: ChangeContext,
  entry: { action: string; recordType: "role" | "user"; recordId: string; summary: string; changes?: Record<string, { old: unknown; new: unknown }> },
): Promise<void> {
  return recordChange(ctx, { module: "roles-permissions", ...entry });
}
