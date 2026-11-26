/**
 * Use case: a delivery order is ready, so a job opens (once per order).
 * Steps:
 *   1. skip if the order already has a job,
 *   2. take the zone's fee and time and a fresh guest code,
 *   3. save it waiting, and with automatic assignment give it to the
 *      online rider with the fewest jobs.
 */

import type { OrderRef } from "@igongo/contracts/food-ordering";
import { newId, recordChange } from "@igongo/core";
import { ACTIVE_JOB_STATUSES, type DeliveryJob } from "../../domain/delivery-job";
import { pickRider } from "../../domain/pick-rider";
import type { DeliveryDeps } from "../delivery-deps";
import { assignJob } from "./assign-job";

/** A random 4-digit code. */
function guestCode(): string {
  return String((crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) % 10_000).padStart(4, "0");
}

export async function openJob(deps: DeliveryDeps, order: OrderRef): Promise<DeliveryJob> {
  // 1. Once per order.
  const existing = await deps.jobs.byOrder(order.orderId);
  if (existing) return existing;
  // 2. Fee, time and code.
  const rules = await deps.rules.read();
  const zone = rules.zones.find((z) => z.zone === order.deliverTo?.zone);
  const job: DeliveryJob = {
    id: newId("dlv"), orderId: order.orderId, orderNumber: order.number, customerUserId: order.userId, customerName: order.customerName, customerPhone: order.customerPhone,
    place: order.deliverTo ?? { label: "Ask the guest", zone: null, lat: null, lng: null }, fee: zone?.fee ?? 0, minutes: zone?.minutes ?? 0,
    cashToCollect: Math.max(0, order.total - order.paid), status: "waiting", riderUserId: null, riderName: null, code: guestCode(),
    cashCollected: 0, cashHandedIn: false, failReason: null, openedAt: deps.change.now, assignedAt: null, pickedUpAt: null, finishedAt: null,
  };
  await deps.jobs.add(job);
  await recordChange(deps.change, { module: "delivery-riders", action: "delivery.opened", recordType: "delivery", recordId: job.id, summary: `Delivery for order ${job.orderNumber} to ${job.place.label}` });
  // 3. Automatic assignment.
  if (rules.assignment !== "auto") return job;
  const online = (await deps.riders.all()).filter((r) => r.online);
  const active = new Map<string, number>();
  for (const j of await deps.jobs.list({ statuses: ACTIVE_JOB_STATUSES, limit: 500 })) if (j.riderUserId) active.set(j.riderUserId, (active.get(j.riderUserId) ?? 0) + 1);
  const rider = pickRider(online, active);
  return rider ? assignJob(deps, job.id, rider.userId) : job;
}
