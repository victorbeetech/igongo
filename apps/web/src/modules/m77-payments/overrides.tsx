// The hand-made web pages of module 77, by screen number. Every other page
// of the module uses a shared layout from its kind.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { PaymentMethodsPage } from "./presentation/payment-methods/PaymentMethodsPage";

/** Module 77's hand-made web pages. */
export const m77Overrides: ScreenOverrides = {
  "S77-06": (s) => <PaymentMethodsPage screen={s} />,
};
