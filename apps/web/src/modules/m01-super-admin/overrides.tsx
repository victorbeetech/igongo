// The hand-made web pages of module 01, connected to the live API. Every
// other page of the module uses a shared layout from its kind.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { BusinessSettingsPage } from "./presentation/business-settings/BusinessSettingsPage";
import { ModulesListPage } from "./presentation/modules-list/ModulesListPage";

/** Module 01's hand-made web pages. */
export const m01Overrides: ScreenOverrides = {
  "S01-02": (s) => <ModulesListPage screen={s} />,
  "S01-05": (s) => <BusinessSettingsPage screen={s} />,
  "S01-06": (s) => <BusinessSettingsPage screen={s} />,
  "S01-11": (s) => <BusinessSettingsPage screen={s} />,
};
