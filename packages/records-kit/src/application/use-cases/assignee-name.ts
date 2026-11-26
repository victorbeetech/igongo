/** The name of staff member [staffId] for a record, from HR Records. */

import { AppError } from "@igongo/core";
import type { RecordsDeps } from "../records-deps";

/** @throws AppError `bad_request` when the staff member does not exist */
export async function assigneeName(deps: RecordsDeps, staffId: string | null): Promise<string | null> {
  if (!staffId) return null;
  // Without HR Records the ID is kept and shown as it is.
  if (!deps.staff) return staffId;
  const s = await deps.staff.byId(staffId);
  if (!s) throw new AppError("bad_request", "That staff member was not found.");
  return s.name;
}
