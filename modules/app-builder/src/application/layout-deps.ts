/** What App Layout's routes need, built per request by the gateway. */

import type { ChangeContext } from "@igongo/core";
import type { LayoutStore } from "./ports/layout-store";

export interface LayoutDeps {
  store: LayoutStore;
  change: ChangeContext;
}
