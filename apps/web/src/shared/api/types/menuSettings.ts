// The outlets list and which outlets guests can order from (S61-01).

import type { Outlet } from "./outlet";

export interface MenuSettings {
  outlets: Outlet[];
  clientOutlets: string[];
}
