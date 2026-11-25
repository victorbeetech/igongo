// The hand-made web pages of module 05, connected to the live API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { AuditSearchPage } from "./presentation/audit-search/AuditSearchPage";

/** Module 05's hand-made web pages. */
export const m05Overrides: ScreenOverrides = {
  "S05-01": (s) => <AuditSearchPage screen={s} />,
};
