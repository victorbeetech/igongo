/** What the card design routes need, built per request by the gateway. */

import type { ChangeContext } from "@igongo/core";
import type { DesignsStore } from "./ports/designs-store";

export interface DesignsDeps {
  store: DesignsStore;
  change: ChangeContext;
}
