// The hand-made web pages of module 04, connected to the live API. Every
// other page of the module uses a shared layout from its kind.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { AccountDetailPage } from "./presentation/account-detail/AccountDetailPage";
import { AccountsListPage } from "./presentation/accounts-list/AccountsListPage";
import { CreateAccountPage } from "./presentation/create-account/CreateAccountPage";
import { LoginMethodsPage } from "./presentation/login-methods/LoginMethodsPage";

/** Module 04's hand-made web pages. */
export const m04Overrides: ScreenOverrides = {
  "S04-01": (s) => <AccountsListPage screen={s} />,
  "S04-02": (s) => <AccountDetailPage screen={s} />,
  "S04-03": (s) => <CreateAccountPage screen={s} />,
  "S04-06": (s) => <LoginMethodsPage screen={s} />,
};
