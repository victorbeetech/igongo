/** `JobRepository` on Postgres, with Drizzle. */

import type { Database } from "@igongo/core";
import type { DeliverySource } from "@igongo/contracts/delivery-riders";
import { and, count, desc, eq, gte, inArray, like } from "drizzle-orm";
import type { JobFilter, JobRepository } from "../../application/ports/job-repository";
import type { DeliveryJob } from "../../domain/delivery-job";
import { jobs } from "./schema";

export class DrizzleJobRepository implements JobRepository {
  constructor(private readonly db: Database) {}

  async byId(id: string): Promise<DeliveryJob | null> {
    const [row] = await this.db.select().from(jobs).where(eq(jobs.id, id));
    return row ?? null;
  }

  async bySource(source: DeliverySource, orderId: string): Promise<DeliveryJob | null> {
    const [row] = await this.db.select().from(jobs).where(and(eq(jobs.source, source), eq(jobs.orderId, orderId)));
    return row ?? null;
  }

  async countManual(): Promise<number> {
    // Hand-made deliveries carry `D-` numbers; food keeps its order's `F-` number.
    const [row] = await this.db.select({ n: count() }).from(jobs).where(like(jobs.orderNumber, "D-%"));
    return Number(row?.n ?? 0);
  }

  list(filter: JobFilter): Promise<DeliveryJob[]> {
    const where = and(
      filter.statuses?.length ? inArray(jobs.status, filter.statuses) : undefined,
      filter.riderUserId ? eq(jobs.riderUserId, filter.riderUserId) : undefined,
      filter.customerUserId ? eq(jobs.customerUserId, filter.customerUserId) : undefined,
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
