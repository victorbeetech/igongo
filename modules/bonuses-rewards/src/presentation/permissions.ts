/**
 * Permission keys Bonuses & Rewards checks. Every staff member sees their
 * own bonuses (`view` with scope `own`); HR and managers award and approve.
 */

export const BONUS_PERMISSIONS = {
  view: "bonuses-rewards.bonuses.view",
  /** Award a bonus. */
  create: "bonuses-rewards.bonuses.create",
  approve: "bonuses-rewards.bonuses.approve",
  /** Serve buffet passes at the buffet (buffet attendants). */
  buffet: "bonuses-rewards.buffet.edit",
  settings: "bonuses-rewards.settings.edit",
} as const;
