/** Where riders' live statuses are kept. */

import type { RiderStatus } from "../../domain/rider-status";

export interface RiderRepository {
  byUserId(userId: string): Promise<RiderStatus | null>;
  all(): Promise<RiderStatus[]>;
  save(status: RiderStatus): Promise<void>;
}
