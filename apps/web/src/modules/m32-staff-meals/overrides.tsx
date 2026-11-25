// The hand-made web pages of module 32 (Staff Meals), connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { CanteenPage } from "./presentation/canteen/CanteenPage";
import { MealsTodayPage, MyMealsPage } from "./presentation/meals-today/MealsTodayPage";

/** Module 32's hand-made web pages. */
export const m32Overrides: ScreenOverrides = {
  "S32-01": (s) => <MyMealsPage screen={s} />,
  "S32-02": (s) => <CanteenPage screen={s} />,
  "S32-03": (s) => <CanteenPage screen={s} />,
  "S32-04": (s) => <MealsTodayPage screen={s} />,
};
