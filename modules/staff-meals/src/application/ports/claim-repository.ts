/** Where meal claims are kept. */

import type { MealClaim } from "../../domain/meal-claim";

export interface ClaimRepository {
  /** The claim of [mealKey] by [staffId] on [workDate], or null. */
  find(staffId: string, workDate: string, mealKey: string): Promise<MealClaim | null>;
  add(claim: MealClaim): Promise<void>;
  list(filter: { workDate: string; staffId?: string; department?: string }): Promise<MealClaim[]>;
}
