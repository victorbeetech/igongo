/**
 * Points rules: the numbers the super admin sets for the points programme.
 * Every field is editable on the admin screen. The programme starts switched
 * off, so guests see no points at all until the super admin turns it on.
 */

/** The points programme's rules as saved. */
export interface PointsRules {
  /** The switch. When false, guests see no points UI and no points are earned or spent. */
  enabled: boolean;
  /** Points earned for every 1,000 UGX spent on a paid order (rounded down). */
  pointsPer1000Ugx: number;
  /** Points given once when a guest's account is created (0 for none). */
  signupBonus: number;
  /** The fewest points a guest may spend in one go. */
  minimumToRedeem: number;
  /** Shillings off for each point spent. */
  ugxPerPoint: number;
  /** Days before earned points expire. 0 means they never expire. */
  expiryDays: number;
}

/**
 * The starting rules, used until the super admin saves their own. Switched
 * off, so nothing is earned or shown before the hotel decides.
 */
export const DEFAULT_POINTS_RULES: PointsRules = {
  enabled: false,
  pointsPer1000Ugx: 1,
  signupBonus: 0,
  minimumToRedeem: 100,
  ugxPerPoint: 10,
  expiryDays: 365,
};

/** Points a paid amount earns under [rules]: `pointsPer1000Ugx` for each 1,000 UGX, rounded down. */
export function pointsForSpend(rules: PointsRules, amountUgx: number): number {
  // Multiply first, then divide once, so rounding happens only at the end.
  return Math.max(0, Math.floor((amountUgx * rules.pointsPer1000Ugx) / 1000));
}

/** The shillings [points] are worth under [rules]. */
export function valueOfPoints(rules: PointsRules, points: number): number {
  return points * rules.ugxPerPoint;
}

/**
 * When points earned at [earnedAt] expire under [rules], or null when they
 * never do (expiry set to 0 days).
 */
export function expiryFor(rules: PointsRules, earnedAt: Date): Date | null {
  if (rules.expiryDays <= 0) return null;
  return new Date(earnedAt.getTime() + rules.expiryDays * 24 * 60 * 60 * 1000);
}
