// The hand-made web pages of module 77 (Payments), live from the API.
// Every other page of the module uses a shared layout from its kind.

import type { ScreenOverrides } from "@/shared/catalog/types";
import { PaymentMethodsPage } from "./presentation/payment-methods/PaymentMethodsPage";
import { PayPage } from "./presentation/pay/PayPage";
import { PaymentResultPage } from "./presentation/payment-result/PaymentResultPage";
import { PaymentsListPage } from "./presentation/payments-list/PaymentsListPage";
import { RecordPaymentPage } from "./presentation/record-payment/RecordPaymentPage";
import { SettlementsPage } from "./presentation/settlements/SettlementsPage";

/** Module 77's hand-made web pages. */
export const m77Overrides: ScreenOverrides = {
  "S77-01": (s) => <PayPage screen={s} />,
  "S77-02": (s) => <PayPage screen={s} />,
  "S77-03": (s) => <PaymentResultPage screen={s} />,
  "S77-04": (s) => <PaymentsListPage screen={s} />,
  "S77-06": (s) => <PaymentMethodsPage screen={s} />,
  "S77-07": (s) => <SettlementsPage screen={s} />,
  "S77-08": (s) => <RecordPaymentPage screen={s} />,
  "S77-10": (s) => <RecordPaymentPage screen={s} />,
};
