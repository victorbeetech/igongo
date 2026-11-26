/**
 * One role's app layout, set by the super admin in the layout editor
 * (S03-01, S03-04): the order of its menu, the modules it hides, its bottom
 * tabs and its home tiles. Nothing here grants access: a person still sees
 * only the modules their permissions open.
 */

export interface RoleLayout {
  roleId: string;
  /** Module keys in the order the menu shows them; the rest follow A to Z. */
  menu: string[];
  /** Module keys left out of this role's menu (still reachable by link). */
  hidden: string[];
  /** Screen IDs for the bottom bar, at most five, such as `S20-01`. */
  tabs: string[];
  /** Home tiles in order; empty means the role's pre-made tiles. */
  tiles: string[];
  /** Goes up by one on every publish. */
  version: number;
  updatedAt: string | null;
  updatedBy: string | null;
}

/** The layout of a role nobody has changed yet. */
export const emptyLayout = (roleId: string): RoleLayout => ({ roleId, menu: [], hidden: [], tabs: [], tiles: [], version: 0, updatedAt: null, updatedBy: null });
