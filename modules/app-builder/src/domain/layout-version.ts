/** One published version of a role's layout, kept for roll back (S03-09). */

import type { RoleLayout } from "./role-layout";

export interface LayoutVersion {
  version: number;
  layout: RoleLayout;
  publishedAt: string;
  publishedBy: string | null;
}

/** How many past versions are kept per role. */
export const HISTORY_SIZE = 20;
