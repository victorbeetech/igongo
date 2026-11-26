/** A note staff keep on a guest (S54-02), such as "prefers the garden table". */

export interface StaffNote {
  id: string;
  profileId: string;
  text: string;
  /** The staff member's user ID and name. */
  byUserId: string | null;
  byName: string | null;
  at: Date;
}
