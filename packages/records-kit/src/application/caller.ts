/** Who is acting, as the use cases need it: worked out from the permissions by the router. */

export interface Caller {
  userId: string;
  name: string;
  /** The caller's staff record, when they are staff (records are assigned to staff). */
  staffId: string | null;
  /** Holds the permission for other people's records too (staff tools), not only their own. */
  wide: boolean;
  /** Holds the module's approve permission. */
  canApprove: boolean;
}
