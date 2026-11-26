// One role's published app layout (module 3), as the layout API returns it.

export interface RoleLayout {
  roleId: string;
  /** Module keys in menu order; the rest follow A to Z. */
  menu: string[];
  /** Module keys left out of the menu. */
  hidden: string[];
  /** Bottom bar screen IDs, at most five. */
  tabs: string[];
  /** Home tiles in order; empty means the role's pre-made tiles. */
  tiles: string[];
  version: number;
  updatedAt: string | null;
}
