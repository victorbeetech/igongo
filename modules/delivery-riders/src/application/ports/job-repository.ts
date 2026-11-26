/** Where delivery jobs are kept. */

import type { DeliverySource } from "@igongo/contracts/delivery-riders";
import type { DeliveryJob, JobStatus } from "../../domain/delivery-job";

/** Filters for a jobs list. Every filter is optional. */
export interface JobFilter {
  statuses?: JobStatus[];
  riderUserId?: string;
  /** The guest the delivery is for (the tracker's "my deliveries"). */
  customerUserId?: string;
  since?: Date;
  limit: number;
}

export interface JobRepository {
  byId(id: string): Promise<DeliveryJob | null>;
  /** The job of record [orderId] in [source], if one was opened. */
  bySource(source: DeliverySource, orderId: string): Promise<DeliveryJob | null>;
  list(filter: JobFilter): Promise<DeliveryJob[]>;
  /** How many deliveries were opened by hand (parcels, laundry, shop), for the next `D-` number. */
  countManual(): Promise<number>;
  add(job: DeliveryJob): Promise<void>;
  update(job: DeliveryJob): Promise<void>;
}
