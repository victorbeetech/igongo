/**
 * Use cases for the rider on a job (S66-04 to S66-07):
 *   - accept or decline an assigned job (declined jobs go back to waiting),
 *   - pick up at the kitchen pass (the order goes "on the way"),
 *   - deliver with the guest's code and any cash collected (the order is
 *     "delivered"), or report a failed delivery with a reason.
 * Each step checks the job is this rider's, records it, moves the record on
 * in the module it came from (food), and pushes the news to the guest.
 */

import { AppError, recordChange } from "@igongo/core";
import type { DeliveryJob, JobStatus } from "../../domain/delivery-job";
import { deliveredMessage, failedMessage, onTheWayMessage } from "../../domain/delivery-messages";
import type { DeliveryDeps } from "../delivery-deps";
import { jobOf } from "./assign-job";

/** The rider's job [id] in one of [from]. @throws AppError when it is someone else's or in the wrong state */
async function myJob(deps: DeliveryDeps, id: string, riderUserId: string, from: JobStatus[]): Promise<DeliveryJob> {
  const job = await jobOf(deps, id);
  if (job.riderUserId !== riderUserId) throw new AppError("not_found", "Delivery not found.");
  if (!from.includes(job.status)) throw new AppError("conflict", `This delivery is ${job.status.replace(/_/g, " ")}.`);
  return job;
}

/** Pushes [message] to the guest, when the delivery belongs to an account. */
async function tellGuest(deps: DeliveryDeps, job: DeliveryJob, message: Parameters<DeliveryDeps["notify"]>[1]) {
  if (job.customerUserId) await deps.notify([job.customerUserId], message);
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
  await deps.trackers[job.source]?.advance(job.orderId, "on_the_way");
  const moved = await save(deps, { ...job, status: "picked_up", pickedUpAt: deps.change.now }, "delivery.picked_up", `${job.riderName} picked up ${job.orderNumber}`);
  await tellGuest(deps, moved, onTheWayMessage(moved));
  return moved;
}

export async function deliverJob(deps: DeliveryDeps, id: string, rider: string, proof: { code?: string; cashCollected?: number }): Promise<DeliveryJob> {
  const job = await myJob(deps, id, rider, ["picked_up"]);
  const rules = await deps.rules.read();
  if (rules.proof === "code" && proof.code !== job.code) throw new AppError("bad_request", "That is not the guest's code. Ask them to read it from their app.");
  const cash = proof.cashCollected ?? 0;
  if (cash > 0 && !rules.ridersCarryCash) throw new AppError("method_disabled", "Riders do not take cash.");
  await deps.trackers[job.source]?.advance(job.orderId, "delivered");
  const done: DeliveryJob = { ...job, status: "delivered", cashCollected: cash, finishedAt: deps.change.now };
  await save(deps, done, "delivery.delivered", `${job.riderName} delivered ${job.orderNumber}${cash ? `, collected ${cash} UGX` : ""}`);
  await tellGuest(deps, done, deliveredMessage(done));
  return done;
}

export async function failJob(deps: DeliveryDeps, id: string, rider: string, reason: string): Promise<DeliveryJob> {
  const job = await myJob(deps, id, rider, ["accepted", "picked_up"]);
  const failed = await save(deps, { ...job, status: "failed", failReason: reason, finishedAt: deps.change.now }, "delivery.failed", `${job.orderNumber} not delivered: ${reason}`);
  await tellGuest(deps, failed, failedMessage(failed));
  return failed;
}
