/**
 * The delivery tracker (S66-10): what the guest sees while anything is on
 * its way to them, whatever it is (food, shop items, laundry, a parcel).
 * Built from the job and the rider's last location; the same shape for
 * every source, so one tracker screen serves them all.
 */

import type { DeliveryJob, JobStatus } from "./delivery-job";
import type { RiderStatus } from "./rider-status";

/** The tracker's steps, in order. A failed job stops at the step it failed on. */
export const TRACK_STEPS = ["waiting", "assigned", "picked_up", "delivered"] as const;
export type TrackStep = (typeof TRACK_STEPS)[number];

/** One step of the tracker, done or not, with when it happened. */
export interface TrackPoint {
  step: TrackStep;
  done: boolean;
  at: string | null;
}

export interface TrackView {
  jobId: string;
  source: DeliveryJob["source"];
  /** The number people quote, such as `F-0042`. */
  reference: string;
  what: string | null;
  status: JobStatus;
  place: string;
  steps: TrackPoint[];
  riderName: string | null;
  /** The guest's 4-digit code, to give the rider at the door. */
  code: string;
  cashToCollect: number;
  /** The zone's usual minutes on the road. */
  minutes: number;
  /** When it should arrive (only once a rider has it), as an ISO time. */
  eta: string | null;
  /** The rider's last position, only while the guest's delivery is on the road. */
  rider: { lat: number | null; lng: number | null; at: string | null } | null;
  failReason: string | null;
}

/** A job's step on the tracker: accepted counts as assigned. */
function stepOf(status: JobStatus): TrackStep {
  if (status === "accepted") return "assigned";
  if (status === "failed") return "picked_up";
  return status;
}

/** The tracker view of [job], with [where] the rider is (if known). */
export function trackingOf(job: DeliveryJob, where: RiderStatus | null): TrackView {
  const reached = TRACK_STEPS.indexOf(stepOf(job.status));
  const times: Record<TrackStep, Date | null> = { waiting: job.openedAt, assigned: job.assignedAt, picked_up: job.pickedUpAt, delivered: job.status === "delivered" ? job.finishedAt : null };
  const onRoad = job.status === "picked_up";
  // Arrival: the zone's travel time from pick-up (or from now while still at the kitchen).
  const from = job.pickedUpAt ?? job.assignedAt;
  return {
    jobId: job.id,
    source: job.source,
    reference: job.orderNumber,
    what: job.what,
    status: job.status,
    place: job.place.label,
    steps: TRACK_STEPS.map((step, i) => ({ step, done: i <= reached && !(job.status === "failed" && step === "picked_up" && !job.pickedUpAt), at: times[step]?.toISOString() ?? null })),
    riderName: job.riderName,
    code: job.code,
    cashToCollect: job.cashToCollect,
    minutes: job.minutes,
    eta: from && job.status !== "delivered" && job.status !== "failed" ? new Date(from.getTime() + job.minutes * 60_000).toISOString() : null,
    rider: where && onRoad ? { lat: where.lat, lng: where.lng, at: where.locationAt?.toISOString() ?? null } : null,
    failReason: job.failReason,
  };
}
