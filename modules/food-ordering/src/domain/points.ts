/**
 * Loyalty points earned from food. The super admin sets how many points a
 * guest gets for each 1,000 shillings of delivered food (0 switches points
 * off). Only whole 1,000-shilling steps count, so 2,999 spent earns for 2,000.
 * Spending points is not built yet; this only works out what has been earned.
 */

/** Shillings in one earning step. */
export const POINTS_STEP_SHILLINGS = 1000;

/**
 * The points earned for [spent] shillings at [pointsPer1000] points per step.
 * Returns 0 when points are off or nothing was spent.
 */
export function pointsEarned(spent: number, pointsPer1000: number): number {
  // Step 1: points are off when the rate is 0 (or the spend is nothing).
  if (pointsPer1000 <= 0 || spent <= 0) return 0;
  // Step 2: count the whole steps the guest spent, then multiply by the rate.
  return Math.floor(spent / POINTS_STEP_SHILLINGS) * pointsPer1000;
}
