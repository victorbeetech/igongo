// The hand-made web pages of module 3 (App Layout & Navigation), live from
// the API: the layout editor, its history and the app-wide layout rules.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { LayoutEditorPage } from "./presentation/LayoutEditorPage";
import { LayoutHistoryPage } from "./presentation/LayoutHistoryPage";
import { LayoutSettingsPage } from "./presentation/LayoutSettingsPage";

/** Module 3's hand-made web pages. */
export const m03Overrides: ScreenOverrides = {
  "S03-01": (s) => <LayoutEditorPage screen={s} />,
  "S03-02": (s) => <LayoutEditorPage screen={s} />,
  "S03-03": (s) => <LayoutEditorPage screen={s} />,
  "S03-04": (s) => <LayoutEditorPage screen={s} />,
  "S03-05": (s) => <LayoutEditorPage screen={s} />,
  "S03-08": (s) => <LayoutEditorPage screen={s} />,
  "S03-09": (s) => <LayoutHistoryPage screen={s} />,
  "S03-06": (s) => <LayoutSettingsPage screen={s} />,
  "S03-07": (s) => <LayoutSettingsPage screen={s} />,
};
