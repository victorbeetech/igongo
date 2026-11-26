// The hand-made web pages of module 81 (Reports & Analytics), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { ReportBuilderPage } from "./presentation/builder/ReportBuilderPage";
import { DashboardPage } from "./presentation/dashboard/DashboardPage";
import { SavedReportsPage } from "./presentation/saved/SavedReportsPage";
import { TileSettingsPage } from "./presentation/settings/TileSettingsPage";

/** Module 81's hand-made web pages. */
export const m81Overrides: ScreenOverrides = {
  "S81-01": (s) => <DashboardPage screen={s} />,
  "S81-02": (s) => <DashboardPage screen={s} />,
  "S81-03": (s) => <ReportBuilderPage screen={s} />,
  "S81-04": (s) => <SavedReportsPage screen={s} />,
  "S81-05": (s) => <SavedReportsPage screen={s} scheduledOnly />,
  "S81-06": (s) => <TileSettingsPage screen={s} />,
};
