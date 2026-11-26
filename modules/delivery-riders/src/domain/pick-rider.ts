/** Automatic assignment: the online rider with the fewest current jobs (ties: the one online longest). */

import type { RiderStatus } from "./rider-status";

export function pickRider(online: RiderStatus[], activeJobs: Map<string, number>): RiderStatus | null {
  const ranked = [...online].sort((a, b) => (activeJobs.get(a.userId) ?? 0) - (activeJobs.get(b.userId) ?? 0) || a.updatedAt.getTime() - b.updatedAt.getTime());
  return ranked[0] ?? null;
}
