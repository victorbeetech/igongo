/**
 * A points lot: one batch of points a guest earned at one time, and how many
 * of them are still unspent. Lots let expiry work per batch: spending takes
 * the oldest points first, and each lot expires on its own date.
 */

/** One batch of points earned by a guest. */
export interface PointsLot {
  /** Unique ID of the lot. */
  id: string;
  /** The guest's user ID. */
  guestId: string;
  /** Points the lot started with. */
  earned: number;
  /** Points still unspent. Never below 0. */
  remaining: number;
  /** When the points were earned. Spending uses the oldest lots first. */
  earnedAt: Date;
  /** When the unspent points expire, or null when they never do. */
  expiresAt: Date | null;
  /** The event that created the lot (a paid order, a sign-up, an adjustment). Used so a retry never adds points twice. */
  sourceRef: string;
}

/** True when a lot still has points that can be spent at [now]. */
export function isUsable(lot: PointsLot, now: Date): boolean {
  return lot.remaining > 0 && (lot.expiresAt === null || lot.expiresAt.getTime() > now.getTime());
}

/** Total spendable points across [lots] at [now]. Expired lots count as zero. */
export function balanceOf(lots: PointsLot[], now: Date): number {
  return lots.filter((l) => isUsable(l, now)).reduce((sum, l) => sum + l.remaining, 0);
}

/** One step of spending: how many points were taken from which lot. */
export interface SpendStep {
  lotId: string;
  points: number;
}

/** The result of spending: the lots that changed and the steps taken. */
export interface SpendResult {
  /** Lots after spending, only the ones that changed. */
  changed: PointsLot[];
  /** Which lots the points came from, oldest first. */
  steps: SpendStep[];
}

/**
 * Takes [points] from the usable lots, oldest first, without changing the
 * input. Returns null when there are not enough usable points.
 */
export function spendOldestFirst(lots: PointsLot[], points: number, now: Date): SpendResult | null {
  // Only usable lots, sorted oldest first. Copy so the input is never changed.
  const usable = lots.filter((l) => isUsable(l, now)).sort((a, b) => a.earnedAt.getTime() - b.earnedAt.getTime());
  if (balanceOf(usable, now) < points) return null;

  const changed: PointsLot[] = [];
  const steps: SpendStep[] = [];
  let left = points;
  for (const lot of usable) {
    if (left <= 0) break;
    // Take as much as this lot has, or as much as is still needed.
    const take = Math.min(lot.remaining, left);
    changed.push({ ...lot, remaining: lot.remaining - take });
    steps.push({ lotId: lot.id, points: take });
    left -= take;
  }
  return { changed, steps };
}
