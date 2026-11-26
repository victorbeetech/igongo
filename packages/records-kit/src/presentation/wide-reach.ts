/**
 * True when [actor] holds [permission] for everyone's records in a records
 * module, not only the ones they are part of. `own` and `assigned` (such as
 * staff on their tasks) reach only their own records; `public` reaches
 * none. Records carry no department, so `department` and `team` reach
 * every record of the module today.
 */

import type { Actor } from "@igongo/contracts/users-login";
import { scopeOf } from "@igongo/core";

export function wideReach(actor: Actor, permission: string): boolean {
  const scope = scopeOf(actor, permission);
  return scope !== null && scope !== "own" && scope !== "assigned" && scope !== "public";
}
