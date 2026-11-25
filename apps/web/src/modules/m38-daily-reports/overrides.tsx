// The hand-made web pages of module 38 (Daily Reports), connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { MyReportPage } from "./presentation/my-report/MyReportPage";
import { ReportDetailPage } from "./presentation/report-detail/ReportDetailPage";
import { MissingReportsPage, ReportsToSignPage } from "./presentation/reports-to-sign/ReportsToSignPage";

/** Module 38's hand-made web pages. */
export const m38Overrides: ScreenOverrides = {
  "S38-01": (s) => <MyReportPage screen={s} />,
  "S38-02": (s) => <MyReportPage screen={s} />,
  "S38-03": (s) => <ReportsToSignPage screen={s} />,
  "S38-05": (s) => <ReportsToSignPage screen={s} />,
  "S38-06": (s) => <ReportDetailPage screen={s} />,
  "S38-08": (s) => <MissingReportsPage screen={s} />,
};
