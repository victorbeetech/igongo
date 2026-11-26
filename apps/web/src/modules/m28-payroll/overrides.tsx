// The hand-made web pages of module 28 (Payroll), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { ProfilesPage } from "./presentation/profiles/ProfilesPage";
import { RunDetailPage } from "./presentation/run-detail/RunDetailPage";
import { RunsPage } from "./presentation/runs/RunsPage";
import { DeductionsPage } from "./presentation/settings/DeductionsPage";

/** Module 28's hand-made web pages. */
export const m28Overrides: ScreenOverrides = {
  "S28-01": (s) => <ProfilesPage screen={s} />,
  "S28-02": (s) => <RunsPage screen={s} />,
  "S28-03": (s) => <RunDetailPage screen={s} />,
  "S28-07": (s) => <DeductionsPage screen={s} />,
};
