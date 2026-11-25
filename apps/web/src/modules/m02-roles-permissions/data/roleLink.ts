// Role pages open each other with `?role=<id>`, such as the permissions
// matrix for one role. One place builds and reads that address.

import { catalog } from "@/shared/catalog/catalogIndex";

/** The address of screen [screenId] for role [roleId]. */
export function roleHref(screenId: string, roleId: string): string {
  return `${catalog.hrefOf(catalog.screen(screenId)!)}?role=${encodeURIComponent(roleId)}`;
}
