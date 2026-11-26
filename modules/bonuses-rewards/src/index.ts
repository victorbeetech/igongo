/**
 * Bonuses & Rewards (module 31) of the Igongo API: cash and buffet-access
 * bonuses. The gateway imports only this file. See the module README.
 */

export type { BonusesDeps } from "./application/bonuses-deps";
export { hasPassFor, type Bonus } from "./domain/bonus";
export { DEFAULT_BONUS_RULES, type BonusRules } from "./domain/bonus-rules";
export { bonusKpis } from "./infrastructure/bonus-kpis";
export { bonusHistory, cashBonusSource } from "./infrastructure/bonus-sources";
export { DrizzleBonusRepository } from "./infrastructure/db/drizzle-bonus-repository";
export { SettingsBonusRulesStore } from "./infrastructure/db/settings-rules-store";
export { BONUS_PERMISSIONS } from "./presentation/permissions";
export { bonusesRouter } from "./presentation/bonuses-router";
