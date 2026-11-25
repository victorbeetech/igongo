/**
 * The super admin's staff meal rules (S32-06): which meals staff get and
 * when the canteen serves each one. Kept as data so they change without code.
 */

import { hotelTime } from "@igongo/core";

/** One meal staff are entitled to, such as lunch from 12:00 to 15:00. */
export interface MealType {
  key: string;
  name: string;
  /** Serving window, `HH:MM` hotel time. */
  startsAt: string;
  endsAt: string;
}

export interface MealRules {
  meals: MealType[];
}

export const DEFAULT_MEAL_RULES: MealRules = {
  meals: [
    { key: "breakfast", name: "Breakfast", startsAt: "06:30", endsAt: "09:30" },
    { key: "lunch", name: "Lunch", startsAt: "12:00", endsAt: "15:00" },
    { key: "supper", name: "Supper", startsAt: "18:30", endsAt: "21:30" },
  ],
};

/** The meal being served at [at], or null between meals. */
export function mealServedAt(rules: MealRules, at: Date): MealType | null {
  const now = hotelTime(at);
  // HH:MM strings compare correctly as text.
  return rules.meals.find((m) => m.startsAt <= now && now <= m.endsAt) ?? null;
}
