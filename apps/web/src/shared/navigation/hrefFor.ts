// Turns a link target from the inventory into an address: the role home, a
// screen, or a dialog over the current page. Every link in the portal uses it.

import { catalog } from "@/shared/catalog/catalogIndex";

/** The address for [id] (`home`, S.. or D..), seen from the page at [currentPath]. */
export function hrefFor(id: string, currentPath: string): string {
  // Step 1: the role home.
  if (id === "home") return "/home";
  // Step 2: a dialog opens over the page the person is on.
  const dialog = catalog.dialog(id);
  if (dialog) return `${currentPath}?dialog=${dialog.slug}`;
  // Step 3: a screen has its own address.
  const screen = catalog.screen(id);
  return screen ? catalog.hrefOf(screen) : "/not-found";
}
