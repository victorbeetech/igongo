/**
 * A payment provider (MTN MoMo, Airtel Money, Flutterwave), behind one
 * shape so use cases never see provider details. Each adapter reads its
 * keys from the Super Admin Console when called, so new keys work at once.
 */

/** What the payer is asked to pay. */
export interface ProviderCharge {
  paymentId: string;
  amount: number;
  label: string;
  /** International form, such as `256772123456`, for prompts. */
  msisdn: string | null;
  payerName: string;
  payerEmail: string | null;
  /** Where the provider tells us the result. */
  callbackUrl: string;
  /** Where a card payer comes back to. */
  returnUrl: string;
}

/** The provider's answer to a new charge. */
export interface ProviderStarted {
  providerRef: string;
  /** The card checkout page, for redirect methods. */
  redirectUrl: string | null;
  message: string;
}

/** The provider's verdict on a charge, checked with them directly. */
export interface ProviderVerdict {
  status: "pending" | "succeeded" | "failed";
  /** The amount they say was paid, when they say. */
  amount: number | null;
  message: string | null;
}

export interface PaymentProvider {
  /** True once the super admin has saved all of this provider's keys. Until then its screens are a preview. */
  connected(): Promise<boolean>;
  /** Starts a charge. @throws AppError not_configured when keys are missing */
  start(charge: ProviderCharge): Promise<ProviderStarted>;
  /** Asks the provider how the charge [providerRef] (our [paymentId]) stands. */
  check(providerRef: string, paymentId: string): Promise<ProviderVerdict>;
  /** True when a callback really came from the provider. Providers without signatures return true: we re-check with [check] anyway. */
  trustCallback(headers: Headers): Promise<boolean>;
  /** Our payment ID inside a callback body, when the URL did not carry it. */
  paymentIdIn(body: unknown): string | null;
  /**
   * Sends [amount] back to the payer through the provider (S77-05). Missing
   * for providers whose refund API needs keys the hotel has not got yet;
   * those refunds are paid back by hand and only recorded.
   * @throws AppError when the provider refuses
   */
  refund?(providerRef: string, paymentId: string, amount: number): Promise<{ message: string }>;
}
