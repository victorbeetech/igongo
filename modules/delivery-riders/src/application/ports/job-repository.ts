/** Where delivery jobs are kept. */

import type { DeliveryJob, JobStatus } from "../../domain/delivery-job";

export interface JobRepository {
  byId(id: string): Promise<DeliveryJob | null>;
  byOrder(orderId: string): Promise<DeliveryJob | null>;
  list(filter: { statuses?: JobStatus[]; riderUserId?: string; since?: Date; limit: number }): Promise<DeliveryJob[]>;
  add(job: DeliveryJob): Promise<void>;
  update(job: DeliveryJob): Promise<void>;
}
