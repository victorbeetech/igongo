// The hand-made web pages of module 30 (Advances & Loans), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { AdvanceDetailPage } from "./presentation/detail/AdvanceDetailPage";
import { AdvanceListPage } from "./presentation/list/AdvanceListPage";
import { MyAdvancesPage } from "./presentation/mine/MyAdvancesPage";
import { RequestAdvancePage } from "./presentation/request/RequestAdvancePage";
import { AdvanceRulesPage } from "./presentation/rules/AdvanceRulesPage";

/** Module 30's hand-made web pages. */
export const m30Overrides: ScreenOverrides = {
  "S30-01": (s) => <MyAdvancesPage screen={s} />,
  "S30-02": (s) => <RequestAdvancePage screen={s} />,
  "S30-03": (s) => <AdvanceListPage screen={s} />,
  "S30-04": (s) => <AdvanceListPage screen={s} kind="loan" />,
  "S30-05": (s) => <AdvanceDetailPage screen={s} />,
  "S30-06": (s) => <AdvanceRulesPage screen={s} />,
};
