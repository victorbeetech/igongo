// The hand-made web pages of module 00, by screen number. Every other page
// of the module uses a shared layout from its kind.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { ActiveSessionsPage } from "./presentation/active-sessions/ActiveSessionsPage";
import { GuestHomePage } from "./presentation/guest-home/GuestHomePage";
import { RoleHomePage } from "./presentation/role-home/RoleHomePage";
import { SignInPage } from "./presentation/sign-in/SignInPage";
import { TextSizePage } from "./presentation/text-size/TextSizePage";
import { ThemePage } from "./presentation/theme/ThemePage";

/** Module 00's hand-made web pages. */
export const m00Overrides: ScreenOverrides = {
  "S00-04": (s) => <GuestHomePage screen={s} />,
  "S00-05": (s) => <SignInPage screen={s} />,
  "S00-21": (s) => <RoleHomePage screen={s} />,
  "S00-33": (s) => <TextSizePage screen={s} />,
  "S00-34": (s) => <ThemePage screen={s} />,
  "S00-36": (s) => <ActiveSessionsPage screen={s} />,
};
