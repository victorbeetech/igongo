/**
 * Which stores a person may work in with one permission, from its scope:
 *
 *   all, location        every store
 *   department, team     the stores of their department, and those they keep
 *   assigned, own        only the stores they keep (store keepers)
 */

import type { DataScope } from "@igongo/contracts/roles-permissions";
import type { Store } from "../domain/store";

/** The caller as store reach needs them. */
export interface StoreCaller {
  scope: DataScope | null;
  staffId: string | null;
  department: string | null;
}

export function reachesStore(caller: StoreCaller, store: Store): boolean {
  const { scope } = caller;
  if (scope === "all" || scope === "location") return true;
  const keeps = !!caller.staffId && store.keeperStaffId === caller.staffId;
  if (scope === "department" || scope === "team") return keeps || (!!caller.department && store.department === caller.department);
  return (scope === "assigned" || scope === "own") && keeps;
}
