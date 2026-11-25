/** Records Wristbands changes in the Audit Trail with the caller's details. */

import { recordChange, type ChangeContext } from "@igongo/core";

/** Records one Wristbands action on a band or range. */
export function recordBandChange(ctx: ChangeContext, entry: { action: string; recordId: string; summary: string }): Promise<void> {
  return recordChange(ctx, { module: "wristbands", recordType: "wristband", ...entry });
}
