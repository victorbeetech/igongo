/**
 * Payments (module 77) of the Igongo API. The gateway imports only this
 * file. See modules/payments/README.md.
 */

export type { PaymentsDeps } from "./application/payments-deps";
export type { PaymentProvider } from "./application/ports/payment-provider";
export { METHOD_CATALOG } from "./domain/method-catalog";
export { DEFAULT_METHOD_SETTINGS, methodAllowed, type MethodSettings } from "./domain/method-settings";
export type { Payment } from "./domain/payment";
export { toMsisdn } from "./domain/uganda-phone";
export type { SettlementRow } from "./domain/settlement-row";
export { paymentKpis } from "./infrastructure/payment-kpis";
export { DrizzlePaymentRepository } from "./infrastructure/db/drizzle-payment-repository";
export { SettingsMethodStore } from "./infrastructure/db/settings-method-store";
export { paymentProviders } from "./infrastructure/providers/payment-providers";
export { resendReceiptMailer, type ResendConfig } from "./infrastructure/email/resend-receipt-mailer";
export type { ReceiptMailer, ReceiptResult } from "./application/ports/receipt-mailer";
export { PAYMENT_PERMISSIONS } from "./presentation/permissions";
export { paymentsRouter } from "./presentation/payments-router";
