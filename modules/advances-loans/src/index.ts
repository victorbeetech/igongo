/**
 * Advances & Loans (module 30) of the Igongo API. The gateway imports only
 * this file. See modules/advances-loans/README.md.
 */

export type { AdvancesDeps } from "./application/advances-deps";
export { balanceOf, instalmentOf, type Advance } from "./domain/advance";
export { DEFAULT_ADVANCE_RULES, requestBreak, type AdvanceRules } from "./domain/advance-rules";
export { nextMonth, payMonthOf } from "./domain/pay-month";
export { advanceKpis } from "./infrastructure/advance-kpis";
export { advanceHistory, advanceRecovery } from "./infrastructure/advance-recovery";
export { DrizzleAdvanceRepository } from "./infrastructure/db/drizzle-advance-repository";
export { SettingsAdvanceRulesStore } from "./infrastructure/db/settings-rules-store";
export { ADVANCE_PERMISSIONS } from "./presentation/permissions";
export { advancesRouter } from "./presentation/advances-router";
