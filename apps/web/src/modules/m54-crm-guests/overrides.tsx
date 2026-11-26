// The hand-made web pages of module 54 (CRM: Guest & Client Profiles), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { GuestsListPage } from "./presentation/guests-list/GuestsListPage";
import { MyAccountPage } from "./presentation/my-account/MyAccountPage";

/** Module 54's hand-made web pages. */
export const m54Overrides: ScreenOverrides = {
  "S54-01": (s) => <GuestsListPage screen={s} />,
  "S54-05": (s) => <MyAccountPage screen={s} />,
  "S54-06": (s) => <MyAccountPage screen={s} />,
  "S54-07": (s) => <MyAccountPage screen={s} />,
};
