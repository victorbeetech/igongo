// The hand-made web pages of module 11 (Files & Media), live from the API.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { FileSettingsPage } from "./presentation/settings/FileSettingsPage";

/** Module 11's hand-made web pages. */
export const m11Overrides: ScreenOverrides = {
  "S11-04": (s) => <FileSettingsPage screen={s} />,
};
