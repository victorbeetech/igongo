// Finds the screen for an address. Shared by the built pages and the static
// preview, so both read addresses the same way.

import { catalog } from "./catalogIndex";
import type { ScreenSpec } from "./types";

/** The screen at [path]: `/` is the guest home, `/home` the role home, anything else a screen route. */
export function screenFor(path: string): ScreenSpec | undefined {
  if (path === "/") return catalog.screen("S00-04");
  if (path === "/home") return catalog.screen("S00-21");
  return catalog.screenAt(path);
}
