/** Everything the points use cases need, given by the gateway per request. */

import type { ChangeContext } from "@igongo/core";
import type { PointsStore } from "./ports/points-store";

export interface PointsDeps {
  /** Where rules, lots and history are kept. */
  store: PointsStore;
  /** Who is acting, and the audit trail that records admin changes. */
  change: ChangeContext;
}
