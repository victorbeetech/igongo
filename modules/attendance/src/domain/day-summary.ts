/**
 * A person's day, worked out from their clock events: first in, last out,
 * time on site, late or not, and whether they are on site now.
 */

import type { ClockEvent } from "./clock-event";

export interface DaySummary {
  staffId: string;
  workDate: string;
  department: string | null;
  firstIn: Date | null;
  lastOut: Date | null;
  /** Minutes between each in and the out after it (an open "in" counts until [now]). */
  minutesOnSite: number;
  late: boolean;
  /** The last event is an "in". */
  onSite: boolean;
  events: number;
}

/**
 * Summarises one person's events for one day (any order).
 * @param now the time to count an open clock-in up to
 */
export function summarizeDay(events: ClockEvent[], now: Date): DaySummary | null {
  const sorted = [...events].sort((a, b) => a.at.getTime() - b.at.getTime());
  const first = sorted[0];
  if (!first) return null;
  // Pair each "in" with the next "out".
  let minutes = 0;
  let openSince: Date | null = null;
  for (const e of sorted) {
    if (e.kind === "in" && !openSince) openSince = e.at;
    if (e.kind === "out" && openSince) {
      minutes += (e.at.getTime() - openSince.getTime()) / 60000;
      openSince = null;
    }
  }
  if (openSince) minutes += Math.max(0, (now.getTime() - openSince.getTime()) / 60000);
  const ins = sorted.filter((e) => e.kind === "in");
  const outs = sorted.filter((e) => e.kind === "out");
  const last = sorted[sorted.length - 1] as ClockEvent;
  return {
    staffId: first.staffId,
    workDate: first.workDate,
    department: last.department,
    firstIn: ins[0]?.at ?? null,
    lastOut: outs[outs.length - 1]?.at ?? null,
    minutesOnSite: Math.round(minutes),
    late: ins[0]?.late ?? false,
    onSite: last.kind === "in",
    events: sorted.length,
  };
}

/** One summary per person and day from a mixed list of events. */
export function summarizeAll(events: ClockEvent[], now: Date): DaySummary[] {
  const groups = new Map<string, ClockEvent[]>();
  for (const e of events) {
    const key = `${e.staffId}|${e.workDate}`;
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  return [...groups.values()].flatMap((g) => summarizeDay(g, now) ?? []);
}
