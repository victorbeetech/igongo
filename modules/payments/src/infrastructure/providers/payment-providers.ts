/** Every provider adapter, built for one request with the stored keys. */

import type { PaymentMethod } from "@igongo/contracts/payments";
import type { SecretReader } from "@igongo/contracts/super-admin";
import type { PaymentProvider } from "../../application/ports/payment-provider";
import { airtelMoneyProvider } from "./airtel-money-provider";
import { flutterwaveProvider } from "./flutterwave-provider";
import { mtnMomoProvider, type EnvironmentOf } from "./mtn-momo-provider";
import type { Fetch } from "./provider-http";

export function paymentProviders(secrets: SecretReader, environment: EnvironmentOf, fetchFn: Fetch = (u, i) => fetch(u, i)): Partial<Record<PaymentMethod, PaymentProvider>> {
  return {
    mtn_momo: mtnMomoProvider(secrets, environment, fetchFn),
    airtel_money: airtelMoneyProvider(secrets, environment, fetchFn),
    card: flutterwaveProvider(secrets, fetchFn),
  };
}
