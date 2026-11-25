/** A post on the notice board: an announcement for all staff or chosen roles. */

export interface Notice {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  /** Role keys who see it; empty means every staff member. */
  audienceRoles: string[];
  pinned: boolean;
  /** Per-post switches, under the board-wide ones. */
  allowComments: boolean;
  allowLikes: boolean;
  createdAt: Date;
  updatedAt: Date;
  /** Removed posts stay in the database for the record. */
  removedAt: Date | null;
}

/** The fields an author writes or changes. */
export type NoticeDraft = Pick<Notice, "title" | "body" | "audienceRoles" | "pinned" | "allowComments" | "allowLikes">;

/** True when a person holding [roleKeys] (and staff or not) may see [notice]. */
export function canSee(notice: Pick<Notice, "audienceRoles" | "removedAt">, viewer: { roleKeys: string[]; isStaff: boolean }): boolean {
  if (notice.removedAt) return false;
  if (notice.audienceRoles.length === 0) return viewer.isStaff;
  return notice.audienceRoles.some((r) => viewer.roleKeys.includes(r));
}
