// The hand-made web pages of module 61 (Menus & Catalogue), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { MenuEditorPage } from "./presentation/menu-editor/MenuEditorPage";
import { MenusPage } from "./presentation/menus/MenusPage";

/** Module 61's hand-made web pages. */
export const m61Overrides: ScreenOverrides = {
  "S61-01": (s) => <MenusPage screen={s} />,
  "S61-02": (s) => <MenuEditorPage screen={s} />,
  "S61-03": (s) => <MenuEditorPage screen={s} />,
  "S61-04": (s) => <MenusPage screen={s} />,
};
