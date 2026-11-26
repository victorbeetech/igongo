// The hand-made web pages of module 29 (Earnings Statements), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { PayslipPage } from "./presentation/payslip/PayslipPage";
import { PayslipsPage } from "./presentation/payslips/PayslipsPage";
import { MyStatementPage, StaffStatementPage } from "./presentation/statement/StatementPages";

/** Module 29's hand-made web pages. */
export const m29Overrides: ScreenOverrides = {
  "S29-01": (s) => <PayslipsPage screen={s} />,
  "S29-02": (s) => <PayslipPage screen={s} />,
  "S29-03": (s) => <MyStatementPage screen={s} />,
  "S29-04": (s) => <StaffStatementPage screen={s} />,
};
