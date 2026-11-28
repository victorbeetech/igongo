// The hand-made web pages of module 10 (Notifications), by screen number.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { PostUpdatePage } from "./presentation/post-update/PostUpdatePage";

/** Module 10's hand-made web pages. */
export const m10Overrides: ScreenOverrides = {
  "S10-04": (s) => <PostUpdatePage screen={s} />,
};
