// The hand-made web pages of module 25 (Attendance), connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { AttendanceBoardPage, OnSitePage } from "./presentation/attendance-board/AttendanceBoardPage";
import { AttendanceRulesPage } from "./presentation/attendance-rules/AttendanceRulesPage";
import { ClockInPage } from "./presentation/clock-in/ClockInPage";
import { MyAttendancePage } from "./presentation/my-attendance/MyAttendancePage";

/** Module 25's hand-made web pages. */
export const m25Overrides: ScreenOverrides = {
  "S25-01": (s) => <ClockInPage screen={s} />,
  "S25-03": (s) => <MyAttendancePage screen={s} />,
  "S25-04": (s) => <AttendanceBoardPage screen={s} />,
  "S25-05": (s) => <AttendanceBoardPage screen={s} />,
  "S25-06": (s) => <OnSitePage screen={s} />,
  "S25-11": (s) => <AttendanceRulesPage screen={s} />,
};
