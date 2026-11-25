/** A person holding a role, possibly only for a time window. */

export interface RoleAssignment {
  userId: string;
  roleId: string;
  startsAt: Date | null;
  endsAt: Date | null;
  assignedBy: string | null;
  assignedAt: Date;
}

/** True when the assignment gives access at [now]. */
export function isActive(a: Pick<RoleAssignment, "startsAt" | "endsAt">, now: Date): boolean {
  return (!a.startsAt || a.startsAt <= now) && (!a.endsAt || a.endsAt > now);
}
