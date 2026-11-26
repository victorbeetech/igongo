/**
 * Use cases for the rider on a job (S66-04 to S66-07):
 *   - accept or decline an assigned job (declined jobs go back to waiting),
 *   - pick up at the kitchen pass (the order goes "on the way"),
 *   - deliver with the guest's code and any cash collected (the order is
 *     "delivered"), or report a failed delivery with a reason.
 * Each step checks the job is this rider's, and records it.
 */

import { AppError, recordChange } from "@igongo/core";
import type { DeliveryJob, JobStatus } from "../../domain/delivery-job";
import type { DeliveryDeps } from "../delivery-deps";
import { jobOf } from "./assign-job";

/** The rider's job [id] in one of [from]. @throws AppError when it is someone else's or in the wrong state */
async function myJob(deps: DeliveryDeps, id: string, riderUserId: string, from: JobStatus[]): Promise<DeliveryJob> {
  const job = await jobOf(deps, id);
  if (job.riderUserId !== riderUserId) throw new AppError("not_found", "Delivery not found.");
  if (!from.includes(job.status)) throw new AppError("conflict", `This delivery is ${job.status.replace(/_/g, " ")}.`);
  return job;
}

/** Saves [job] and records [summary]. */
async function save(deps: DeliveryDeps, job: DeliveryJob, action: string, summary: string): Promise<DeliveryJob> {
  await deps.jobs.update(job);
  await recordChange(deps.change, { module: "delivery-riders", action, recordType: "delivery", recordId: job.id, summary });
  return job;
}

export async function acceptJob(deps: DeliveryDeps, id: string, rider: string): Promise<DeliveryJob> {
  const job = await myJob(deps, id, rider, ["assigned"]);
  return save(deps, { ...job, status: "accepted" }, "delivery.accepted", `${job.riderName} accepted order ${job.orderNumber}`);
}

export async function declineJob(deps: DeliveryDeps, id: string, rider: string): Promise<DeliveryJob> {
  const job = await myJob(deps, id, rider, ["assigned", "accepted"]);
  return save(deps, { ...job, status: "waiting", riderUserId: null, riderName: null, assignedAt: null }, "delivery.declined", `${job.riderName} handed back order ${job.orderNumber}`);
}

export async function pickUpJob(deps: DeliveryDeps, id: string, rider: string): Promise<DeliveryJob> {
  const job = await myJob(deps, id, rider, ["assigned", "accepted"]);
  await deps.orders?.advance(job.orderId, "on_the_way");
  return save(deps, { ...job, status: "picked_up", pickedUpAt: deps.change.now }, "delivery.picked_up", `${job.riderName} picked up order ${job.orderNumber}`);
}

export async function deliverJob(deps: DeliveryDeps, id: string, rider: string, proof: { code?: string; cashCollected?: number }): Promise<DeliveryJob> {
  const job = await myJob(deps, id, rider, ["picked_up"]);
  const rules = await deps.rules.read();
  if (rules.proof === "code" && proof.code !== job.code) throw new AppError("bad_request", "That is not the guest's code. Ask them to read it from their app.");
  const cash = proof.cashCollected ?? 0;
  if (cash > 0 && !rules.ridersCarryCash) throw new AppError("method_disabled", "Riders do not take cash.");
  await deps.orders?.advance(job.orderId, "delivered");
  const done: DeliveryJob = { ...job, status: "delivered", cashCollected: cash, finishedAt: deps.change.now };
  return save(deps, done, "delivery.delivered", `${job.riderName} delivered order ${job.orderNumber}${cash ? `, collected ${cash} UGX` : ""}`);
}

export async function failJob(deps: DeliveryDeps, id: string, rider: string, reason: string): Promise<DeliveryJob> {
  const job = await myJob(deps, id, rider, ["accepted", "picked_up"]);
  return save(deps, { ...job, status: "failed", failReason: reason, finishedAt: deps.change.now }, "delivery.failed", `Order ${job.orderNumber} not delivered: ${reason}`);
}
