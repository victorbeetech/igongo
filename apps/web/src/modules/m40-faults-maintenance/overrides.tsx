// The hand-made web pages of module 40 (Faults & Maintenance), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { FaultDetailPage } from "./presentation/detail/FaultDetailPage";
import { FaultListPage } from "./presentation/list/FaultListPage";
import { ReportFaultPage } from "./presentation/report/ReportFaultPage";
import { FaultSettingsPage } from "./presentation/settings/FaultSettingsPage";

/** Module 40's hand-made web pages. */
export const m40Overrides: ScreenOverrides = {
  "S40-01": (s) => <ReportFaultPage screen={s} />,
  "S40-02": (s) => <FaultListPage screen={s} view="reported" />,
  "S40-03": (s) => <FaultListPage screen={s} view="scope" />,
  "S40-04": (s) => <FaultDetailPage screen={s} />,
  "S40-05": (s) => <FaultListPage screen={s} view="assigned" />,
  "S40-07": (s) => <FaultSettingsPage screen={s} />,
};
