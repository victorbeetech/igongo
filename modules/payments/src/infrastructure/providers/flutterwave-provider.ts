/**
 * Card payments through Flutterwave Standard (hosted checkout). Keys from
 * the Super Admin Console: flutterwave.secret_key, and flutterwave.secret_hash
 * for webhooks. Steps for a charge:
 *   1. create a checkout link with our payment ID as `tx_ref`,
 *   2. the payer pays on Flutterwave's page and comes back to the web portal,
 *   3. the webhook must carry our secret hash, and we still verify the
 *      transaction with Flutterwave, including the amount and currency.
 */

import type { SecretReader } from "@igongo/contracts/super-admin";
import { AppError } from "@igongo/core";
import type { PaymentProvider } from "../../application/ports/payment-provider";
import { at, callJson, keysFor, type Fetch } from "./provider-http";

const NAME = "Flutterwave";
const BASE = "https://api.flutterwave.com/v3";

export function flutterwaveProvider(secrets: SecretReader, fetchFn: Fetch): PaymentProvider {
  /** The secret key header. */
  async function auth() {
    const k = await keysFor(secrets, NAME, ["flutterwave.secret_key"] as const);
    return { authorization: `Bearer ${k["flutterwave.secret_key"]}`, "content-type": "application/json" };
  }

  return {
    async start(charge) {
      const json = await callJson(fetchFn, NAME, `${BASE}/payments`, {
        method: "POST",
        headers: await auth(),
        body: JSON.stringify({
          tx_ref: charge.paymentId,
          amount: charge.amount,
          currency: "UGX",
          redirect_url: charge.returnUrl,
          customer: { email: charge.payerEmail, name: charge.payerName },
          customizations: { title: "Igongo", description: charge.label },
        }),
      });
      return { providerRef: charge.paymentId, redirectUrl: String(at(json, "data", "link") ?? ""), message: "Opening the secure card page." };
    },
    async check(providerRef) {
      const json = await callJson(fetchFn, NAME, `${BASE}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(providerRef)}`, { headers: await auth() });
      const status = String(at(json, "data", "status") ?? "");
      const currency = String(at(json, "data", "currency") ?? "");
      if (status === "successful" && currency === "UGX") return { status: "succeeded", amount: Number(at(json, "data", "amount")), message: "Paid by card." };
      if (status === "failed" || (status === "successful" && currency !== "UGX")) return { status: "failed", amount: null, message: "The card payment did not go through." };
      return { status: "pending", amount: null, message: null };
    },
    async trustCallback(headers) {
      const hash = await secrets.get("flutterwave.secret_hash");
      return !!hash && headers.get("verif-hash") === hash;
    },
    async refund(providerRef, _paymentId, amount) {
      // Flutterwave refunds by its own transaction ID, so look it up from our reference first.
      const tx = await callJson(fetchFn, NAME, `${BASE}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(providerRef)}`, { headers: await auth() });
      const id = at(tx, "data", "id");
      if (!id) throw new AppError("bad_request", "Flutterwave could not find this payment.");
      await callJson(fetchFn, NAME, `${BASE}/transactions/${encodeURIComponent(String(id))}/refund`, { method: "POST", headers: await auth(), body: JSON.stringify({ amount }) });
      return { message: "Sent back to the card through Flutterwave." };
    },
    paymentIdIn: (body) => (typeof at(body, "data", "tx_ref") === "string" ? String(at(body, "data", "tx_ref")) : null),
  };
}
