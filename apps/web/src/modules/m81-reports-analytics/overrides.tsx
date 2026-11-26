// The hand-made web pages of module 81 (Reports & Analytics), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { DashboardPage } from "./presentation/dashboard/DashboardPage";
import { TileSettingsPage } from "./presentation/settings/TileSettingsPage";

/** Module 81's hand-made web pages. */
export const m81Overrides: ScreenOverrides = {
  "S81-01": (s) => <DashboardPage screen={s} />,
  "S81-02": (s) => <DashboardPage screen={s} />,
  "S81-06": (s) => <TileSettingsPage screen={s} />,
};
