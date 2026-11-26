/** `JobRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import type { JobRepository } from "../../application/ports/job-repository";
import type { DeliveryJob, JobStatus } from "../../domain/delivery-job";
import { jobs } from "./schema";

export class DrizzleJobRepository implements JobRepository {
  constructor(private readonly db: Database) {}

  async byId(id: string): Promise<DeliveryJob | null> {
    const [row] = await this.db.select().from(jobs).where(eq(jobs.id, id));
    return row ?? null;
  }

  async byOrder(orderId: string): Promise<DeliveryJob | null> {
    const [row] = await this.db.select().from(jobs).where(eq(jobs.orderId, orderId));
    return row ?? null;
  }

  list(filter: { statuses?: JobStatus[]; riderUserId?: string; since?: Date; limit: number }): Promise<DeliveryJob[]> {
    const where = and(
      filter.statuses?.length ? inArray(jobs.status, filter.statuses) : undefined,
      filter.riderUserId ? eq(jobs.riderUserId, filter.riderUserId) : undefined,
      filter.since ? gte(jobs.openedAt, filter.since) : undefined,
    );
    return this.db.select().from(jobs).where(where).orderBy(desc(jobs.openedAt)).limit(filter.limit);
  }

  async add(job: DeliveryJob): Promise<void> {
    await this.db.insert(jobs).values(job);
  }

  async update(job: DeliveryJob): Promise<void> {
    const { id, ...rest } = job;
    await this.db.update(jobs).set(rest).where(eq(jobs.id, id));
  }
}
