// The hand-made web pages of module 6 (Records Archive & Search), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { RecordsSearchPage } from "./presentation/search/RecordsSearchPage";

/** Module 6's hand-made web pages. */
export const m06Overrides: ScreenOverrides = {
  "S06-03": (s) => <RecordsSearchPage screen={s} />,
};
