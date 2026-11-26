// One past version of a role's layout, for roll back (S03-09).

import type { RoleLayout } from "./roleLayout";

export interface LayoutVersion {
  version: number;
  layout: RoleLayout;
  publishedAt: string;
  publishedBy: string | null;
}
