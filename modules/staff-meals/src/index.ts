/**
 * Staff Meals (module 32) of the Igongo API. The gateway imports only this
 * file. See modules/staff-meals/README.md.
 */

export type { MealsDeps } from "./application/meals-deps";
export { serveMeal } from "./application/use-cases/serve-meal";
export type { MealClaim } from "./domain/meal-claim";
export { DEFAULT_MEAL_RULES, mealServedAt, type MealRules } from "./domain/meal-rules";
export { DrizzleClaimRepository } from "./infrastructure/db/drizzle-claim-repository";
export { SettingsMealRulesStore } from "./infrastructure/db/settings-meal-rules-store";
export { MEAL_PERMISSIONS } from "./presentation/permissions";
export { mealsRouter } from "./presentation/meals-router";
