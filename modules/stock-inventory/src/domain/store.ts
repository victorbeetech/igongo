/** A store or sub-store, such as the main store, kitchen store or fuel tank. Closed, never deleted. */

export interface Store {
  id: string;
  name: string;
  /** The kind in words, such as "Kitchen" or "Housekeeping". */
  kind: string;
  /** The department that uses it, for department-scoped roles (such as the kitchen). */
  department: string | null;
  /** The store keeper's staff ID; store keepers reach only the stores they keep. */
  keeperStaffId: string | null;
  location: string | null;
  active: boolean;
}
