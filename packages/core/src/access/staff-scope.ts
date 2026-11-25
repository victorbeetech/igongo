/**
 * Turns a permission's data scope into "which staff records may this person
 * see or change". Used by every staff module (Attendance, Daily Reports,
 * Staff Meals...) so they all read scopes the same way.
 *
 *   all, location  -> every staff member (the hotel has one location today)
 *   department     -> staff in the caller's department
 *   team           -> the same as department until Shifts & Rosters adds teams
 *   own, assigned  -> only the caller's own records
 *   public         -> nothing staff-specific
 */

import type { Actor } from "@igongo/contracts/users-login";
import { scopeOf } from "./scope-of";

/** Which staff records a person may reach. */
export type StaffScope = { kind: "all" } | { kind: "department"; department: string } | { kind: "own"; staffId: string };

/** The caller's own staff record, as far as scopes need it. */
export interface ScopeSelf {
  staffId: string;
  department: string | null;
}

/**
 * The staff records [actor] reaches with [permission], or null for none.
 * @param self the caller's own staff record, or null when they have none
 */
export function staffScope(actor: Actor, permission: string, self: ScopeSelf | null): StaffScope | null {
  const scope = scopeOf(actor, permission);
  if (scope === "all" || scope === "location") return { kind: "all" };
  // Narrower scopes need the caller's own staff record to compare with.
  if (!self) return null;
  if ((scope === "department" || scope === "team") && self.department) return { kind: "department", department: self.department };
  if (scope === "department" || scope === "team" || scope === "own" || scope === "assigned") return { kind: "own", staffId: self.staffId };
  return null;
}

/** True when [scope] reaches a record of [staffId] in [department]. */
export function scopeReaches(scope: StaffScope, record: { staffId: string; department: string | null }): boolean {
  if (scope.kind === "all") return true;
  if (scope.kind === "department") return record.department === scope.department;
  return record.staffId === scope.staffId;
}
