// The hand-made web pages of module 14, by screen number. Every other page
// of the module uses a shared layout from its kind.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { ConnectionSettingsPage } from "./presentation/connection-settings/ConnectionSettingsPage";

/** Module 14's hand-made web pages. */
export const m14Overrides: ScreenOverrides = {
  "S14-02": (s) => <ConnectionSettingsPage screen={s} />,
};
