// A store (main store, kitchen, housekeeping), as the stock API returns it.

export interface Store {
  id: string;
  name: string;
  kind: string;
  department: string | null;
  keeperStaffId: string | null;
  location: string | null;
  active: boolean;
  /** True when the caller may move stock in or out of it. */
  mine?: boolean;
}
