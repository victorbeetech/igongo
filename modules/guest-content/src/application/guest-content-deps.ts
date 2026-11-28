/** Everything the guest content use cases need, given by the gateway per request. */

import type { ChangeContext } from "@igongo/core";
import type { GuestContentStore } from "./ports/guest-content-store";

export interface GuestContentDeps {
  /** Where the content document is kept. */
  store: GuestContentStore;
  /** Who is changing it, and the audit trail that records the change. */
  change: ChangeContext;
}
