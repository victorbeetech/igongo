/** Everything Payments' use cases need, given by the gateway per request. */

import type { Payable, PaymentMethod } from "@igongo/contracts/payments";
import type { ChangeContext } from "@igongo/core";
import type { MethodSettingsStore } from "./ports/method-settings-store";
import type { PaymentProvider } from "./ports/payment-provider";
import type { PaymentRepository } from "./ports/payment-repository";

export interface PaymentsDeps {
  payments: PaymentRepository;
  settings: MethodSettingsStore;
  /** An adapter per provider method (mtn_momo, airtel_money, card). */
  providers: Partial<Record<PaymentMethod, PaymentProvider>>;
  /** The selling modules, by module key. A missing one is switched off or not built. */
  payables: Record<string, Payable>;
  change: ChangeContext;
  /** The API's public address, for provider callbacks. */
  apiBase: string;
  /** The web portal's address, for card payers coming back. */
  webBase: string;
}
