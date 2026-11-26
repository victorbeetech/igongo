/**
 * Use cases for a rider's shift (S66-03, S66-08, S66-09):
 *   - goOnline / goOffline, and live location pings;
 *   - myShift: current jobs, today's trips, earnings and cash in hand;
 *   - receiveCash: the dispatcher takes a rider's collected cash.
 */

import { AppError, hotelDate, recordChange } from "@igongo/core";
import { ACTIVE_JOB_STATUSES, type DeliveryJob } from "../../domain/delivery-job";
import type { RiderStatus } from "../../domain/rider-status";
import type { DeliveryDeps } from "../delivery-deps";

export async function setOnline(deps: DeliveryDeps, me: { userId: string; name: string }, online: boolean): Promise<RiderStatus> {
  const before = await deps.riders.byUserId(me.userId);
  const status: RiderStatus = { userId: me.userId, name: me.name, online, lat: before?.lat ?? null, lng: before?.lng ?? null, locationAt: before?.locationAt ?? null, updatedAt: deps.change.now };
  await deps.riders.save(status);
  await recordChange(deps.change, { module: "delivery-riders", action: online ? "rider.online" : "rider.offline", recordType: "rider", recordId: me.userId, summary: `${me.name} went ${online ? "online" : "offline"}` });
  return status;
}

export async function pingLocation(deps: DeliveryDeps, userId: string, lat: number, lng: number): Promise<void> {
  const status = await deps.riders.byUserId(userId);
  if (!status?.online) throw new AppError("conflict", "Go online first.");
  // Locations are live data, not audited changes.
  await deps.riders.save({ ...status, lat, lng, locationAt: deps.change.now });
}

/** Cash a rider holds: collected and not yet handed in. */
export const cashInHand = (jobs: DeliveryJob[]) => jobs.filter((j) => !j.cashHandedIn).reduce((s, j) => s + j.cashCollected, 0);

export async function myShift(deps: DeliveryDeps, userId: string) {
  const rules = await deps.rules.read();
  const jobs = await deps.jobs.list({ riderUserId: userId, since: new Date(deps.change.now.getTime() - 7 * 86_400_000), limit: 500 });
  const today = hotelDate(deps.change.now);
  const tripsToday = jobs.filter((j) => j.status === "delivered" && j.finishedAt && hotelDate(j.finishedAt) === today);
  return {
    status: await deps.riders.byUserId(userId),
    current: jobs.filter((j) => ACTIVE_JOB_STATUSES.includes(j.status)),
    tripsToday: tripsToday.length,
    earningsToday: tripsToday.length * rules.payPerTrip,
    cashInHand: cashInHand(jobs.filter((j) => j.status === "delivered")),
    cashLimit: rules.cashLimit,
    history: jobs.filter((j) => j.status === "delivered" || j.status === "failed"),
  };
}

export async function receiveCash(deps: DeliveryDeps, riderUserId: string): Promise<{ amount: number }> {
  const held = (await deps.jobs.list({ riderUserId, statuses: ["delivered"], limit: 1000 })).filter((j) => !j.cashHandedIn && j.cashCollected > 0);
  for (const j of held) await deps.jobs.update({ ...j, cashHandedIn: true });
  const amount = held.reduce((s, j) => s + j.cashCollected, 0);
  await recordChange(deps.change, { module: "delivery-riders", action: "delivery.cash_received", recordType: "rider", recordId: riderUserId, summary: `Received ${amount} UGX cash from ${held[0]?.riderName ?? "a rider"} (${held.length} deliveries)` });
  return { amount };
}
