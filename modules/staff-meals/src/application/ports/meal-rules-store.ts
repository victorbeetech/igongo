/** Where the meal rules are kept. */

import type { MealRules } from "../../domain/meal-rules";

export interface MealRulesStore {
  read(): Promise<MealRules>;
  write(rules: MealRules, by: string | null, now: Date): Promise<void>;
}
