// A responsive grid for home tiles: two across on phones, up to six on wide screens.

import type { ReactNode } from "react";

/** Lays tiles out in equal columns. */
export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">{children}</div>;
}
