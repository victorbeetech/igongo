/** Reads the content the guest app shows: only the switched-on items. */

import { activeContent } from "../../domain/active-content";
import type { GuestContent } from "../../domain/content";
import type { GuestContentDeps } from "../guest-content-deps";

/** The guest view of the content document. */
export async function readActiveContent(deps: GuestContentDeps): Promise<GuestContent> {
  return activeContent(await deps.store.read());
}

/** The whole document, every item and its switch, for the super admin. */
export function readFullContent(deps: GuestContentDeps): Promise<GuestContent> {
  return deps.store.read();
}
