/**
 * Use cases that open a delivery (once per record):
 *   - openJob: a food delivery order is ready (called by Food Ordering);
 *   - openManualJob: the dispatcher sends anything else (shop items,
 *     laundry, a room service tray, a parcel), with a `D-` number.
 * Both go through openDelivery:
 *   1. skip if the record already has a job,
 *   2. take the zone's fee and time and a fresh guest code,
 *   3. save it waiting, and with automatic assignment give it to the
 *      online rider with the fewest jobs.
 */

import type { DeliverySource } from "@igongo/contracts/delivery-riders";
import type { DeliveryPlace, OrderRef } from "@igongo/contracts/food-ordering";
import { newId, recordChange } from "@igongo/core";
import { ACTIVE_JOB_STATUSES, type DeliveryJob } from "../../domain/delivery-job";
import { pickRider } from "../../domain/pick-rider";
import type { DeliveryDeps } from "../delivery-deps";
import { assignJob } from "./assign-job";

/** What any delivery needs to open. */
export interface DeliveryRequest {
  source: DeliverySource;
  /** The record in the source module; null for a parcel (the job's own ID is used). */
  recordId: string | null;
  /** The number people quote; null gives the next `D-` number. */
  reference: string | null;
  what: string | null;
  customer: { userId: string | null; name: string; phone: string | null };
  place: DeliveryPlace | null;
  cashToCollect: number;
}

/** A random 4-digit code. */
function guestCode(): string {
  return String((crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) % 10_000).padStart(4, "0");
}

export async function openDelivery(deps: DeliveryDeps, request: DeliveryRequest): Promise<DeliveryJob> {
  // 1. Once per record.
  const id = newId("dlv");
  const recordId = request.recordId ?? id;
  const existing = await deps.jobs.bySource(request.source, recordId);
  if (existing) return existing;
  // 2. Fee, time, number and code.
  const rules = await deps.rules.read();
  const zone = rules.zones.find((z) => z.zone === request.place?.zone);
  const reference = request.reference ?? `D-${String((await deps.jobs.countManual()) + 1).padStart(4, "0")}`;
  const job: DeliveryJob = {
    id, source: request.source, orderId: recordId, orderNumber: reference, what: request.what,
    customerUserId: request.customer.userId, customerName: request.customer.name, customerPhone: request.customer.phone,
    place: request.place ?? { label: "Ask the guest", zone: null, lat: null, lng: null }, fee: zone?.fee ?? 0, minutes: zone?.minutes ?? 0,
    cashToCollect: request.cashToCollect, status: "waiting", riderUserId: null, riderName: null, code: guestCode(),
    cashCollected: 0, cashHandedIn: false, failReason: null, openedAt: deps.change.now, assignedAt: null, pickedUpAt: null, finishedAt: null,
  };
  await deps.jobs.add(job);
  await recordChange(deps.change, { module: "delivery-riders", action: "delivery.opened", recordType: "delivery", recordId: job.id, summary: `Delivery ${job.orderNumber} (${job.source.replace(/_/g, " ")}) to ${job.place.label}` });
  // 3. Automatic assignment.
  if (rules.assignment !== "auto") return job;
  const online = (await deps.riders.all()).filter((r) => r.online);
  const active = new Map<string, number>();
  for (const j of await deps.jobs.list({ statuses: ACTIVE_JOB_STATUSES, limit: 500 })) if (j.riderUserId) active.set(j.riderUserId, (active.get(j.riderUserId) ?? 0) + 1);
  const rider = pickRider(online, active);
  return rider ? assignJob(deps, job.id, rider.userId) : job;
}

/** A ready food delivery order (Food Ordering calls this through the DeliveryDesk). */
export function openJob(deps: DeliveryDeps, order: OrderRef): Promise<DeliveryJob> {
  return openDelivery(deps, {
    source: "food", recordId: order.orderId, reference: order.number, what: null,
    customer: { userId: order.userId, name: order.customerName, phone: order.customerPhone },
    place: order.deliverTo, cashToCollect: Math.max(0, order.total - order.paid),
  });
}
