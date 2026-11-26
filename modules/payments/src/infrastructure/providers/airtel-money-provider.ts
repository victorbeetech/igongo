/**
 * Airtel Money (Merchant Collections API, Uganda). Keys from the Super
 * Admin Console: airtel_money.client_id and airtel_money.client_secret.
 * Steps for a charge:
 *   1. get a token with the client ID and secret,
 *   2. send the payment with our payment ID as the transaction ID,
 *   3. Airtel prompts the payer for their PIN;
 *   4. on callback we ask Airtel for the status (TS paid, TF failed).
 */

import type { SecretReader } from "@igongo/contracts/super-admin";
import type { PaymentProvider } from "../../application/ports/payment-provider";
import type { EnvironmentOf } from "./mtn-momo-provider";
import { at, callJson, keysFor, type Fetch } from "./provider-http";

const NAME = "Airtel Money";
const KEYS = ["airtel_money.client_id", "airtel_money.client_secret"] as const;
/** Uganda, in shillings. */
const MARKET = { "x-country": "UG", "x-currency": "UGX" };

export function airtelMoneyProvider(secrets: SecretReader, environment: EnvironmentOf, fetchFn: Fetch): PaymentProvider {
  /** Step 1: where to call, and the headers every call needs. */
  async function session() {
    const base = (await environment()) === "live" ? "https://openapi.airtel.africa" : "https://openapiuat.airtel.africa";
    const k = await keysFor(secrets, NAME, KEYS);
    const token = await callJson(fetchFn, NAME, `${base}/auth/oauth2/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ client_id: k["airtel_money.client_id"], client_secret: k["airtel_money.client_secret"], grant_type: "client_credentials" }),
    });
    return { base, headers: { ...MARKET, authorization: `Bearer ${String(token["access_token"])}`, "content-type": "application/json" } };
  }

  return {
    async start(charge) {
      const { base, headers } = await session();
      await callJson(fetchFn, NAME, `${base}/merchant/v1/payments/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          reference: charge.label.slice(0, 60),
          // Airtel wants the number without the country code.
          subscriber: { country: "UG", currency: "UGX", msisdn: (charge.msisdn ?? "").replace(/^256/, "") },
          transaction: { amount: charge.amount, country: "UG", currency: "UGX", id: charge.paymentId },
        }),
      });
      return { providerRef: charge.paymentId, redirectUrl: null, message: "Check your phone and enter your Airtel Money PIN to approve." };
    },
    async check(providerRef) {
      const { base, headers } = await session();
      const json = await callJson(fetchFn, NAME, `${base}/standard/v1/payments/${providerRef}`, { headers });
      const status = String(at(json, "data", "transaction", "status") ?? "");
      if (status === "TS") return { status: "succeeded", amount: null, message: "Paid with Airtel Money." };
      if (status === "TF") return { status: "failed", amount: null, message: `Airtel Money: ${String(at(json, "data", "transaction", "message") ?? "the payment was not approved")}.` };
      return { status: "pending", amount: null, message: null };
    },
    // `check` asks Airtel itself, so an unsigned callback cannot mark anything paid.
    trustCallback: async () => true,
    paymentIdIn: (body) => (typeof at(body, "transaction", "id") === "string" ? String(at(body, "transaction", "id")) : null),
  };
}
