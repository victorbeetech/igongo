/** Use case: a dispatcher (or the automatic rule) gives a waiting job to a rider who has gone online before. */

import { AppError, recordChange } from "@igongo/core";
import type { DeliveryJob } from "../../domain/delivery-job";
import { assignedMessage } from "../../domain/delivery-messages";
import type { DeliveryDeps } from "../delivery-deps";

/** The job [id]. @throws AppError not_found */
export async function jobOf(deps: DeliveryDeps, id: string): Promise<DeliveryJob> {
  const job = await deps.jobs.byId(id);
  if (!job) throw new AppError("not_found", "Delivery not found.");
  return job;
}

export async function assignJob(deps: DeliveryDeps, id: string, riderUserId: string): Promise<DeliveryJob> {
  const job = await jobOf(deps, id);
  if (job.status !== "waiting" && job.status !== "assigned") throw new AppError("conflict", "This delivery is already on its way.");
  const rider = await deps.riders.byUserId(riderUserId);
  if (!rider) throw new AppError("not_found", "That rider has never gone online.");
  const assigned: DeliveryJob = { ...job, status: "assigned", riderUserId, riderName: rider.name, assignedAt: deps.change.now };
  await deps.jobs.update(assigned);
  await recordChange(deps.change, { module: "delivery-riders", action: "delivery.assigned", recordType: "delivery", recordId: id, summary: `${job.orderNumber} assigned to ${rider.name}` });
  // The rider's phone rings with the new job.
  await deps.notify([riderUserId], assignedMessage(assigned));
  return assigned;
}
