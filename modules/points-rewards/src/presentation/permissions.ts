/** Permission keys the points module checks. The super admin gives them to roles. */

export const POINTS_PERMISSIONS = {
  /** See the points rules and the expiry run (admin screens). */
  view: "points-rewards.rules.view",
  /** Change the points rules and run expiry. */
  edit: "points-rewards.rules.edit",
  /** Give or take away a guest's points by hand, with a note. */
  adjust: "points-rewards.points.adjust",
} as const;
