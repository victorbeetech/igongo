/**
 * MTN Mobile Money (Collections API, "request to pay"). Keys from the
 * Super Admin Console: mtn_momo.api_user, mtn_momo.api_key and
 * mtn_momo.subscription_key. Steps for a charge:
 *   1. get a token with the API user and key,
 *   2. send "request to pay" with our payment ID as the reference,
 *   3. MTN prompts the payer, who approves with their PIN;
 *   4. MTN calls back (unsigned), so we always ask MTN for the status.
 */

import type { SecretReader } from "@igongo/contracts/super-admin";
import type { PaymentProvider } from "../../application/ports/payment-provider";
import { at, callJson, keysFor, type Fetch } from "./provider-http";

const NAME = "MTN MoMo";
const KEYS = ["mtn_momo.api_user", "mtn_momo.api_key", "mtn_momo.subscription_key"] as const;

/** MTN's address and target for [environment]. The sandbox only takes EUR. */
function endpoint(environment: "sandbox" | "live") {
  return environment === "live"
    ? { base: "https://proxy.momoapi.mtn.com", target: "mtnuganda", currency: "UGX" }
    : { base: "https://sandbox.momodeveloper.mtn.com", target: "sandbox", currency: "EUR" };
}

/** Reads the provider environment (sandbox or live) from the payment settings. */
export type EnvironmentOf = () => Promise<"sandbox" | "live">;

export function mtnMomoProvider(secrets: SecretReader, environment: EnvironmentOf, fetchFn: Fetch): PaymentProvider {
  /** Step 1: a short-lived token, the headers every call needs, and where to send them. */
  async function session() {
    const { base, target, currency } = endpoint(await environment());
    const k = await keysFor(secrets, NAME, KEYS);
    const token = await callJson(fetchFn, NAME, `${base}/collection/token/`, {
      method: "POST",
      headers: { authorization: `Basic ${btoa(`${k["mtn_momo.api_user"]}:${k["mtn_momo.api_key"]}`)}`, "ocp-apim-subscription-key": k["mtn_momo.subscription_key"] },
    });
    const headers = { authorization: `Bearer ${String(token["access_token"])}`, "ocp-apim-subscription-key": k["mtn_momo.subscription_key"], "x-target-environment": target };
    return { base, currency, headers };
  }

  return {
    async start(charge) {
      const { base, currency, headers } = await session();
      // MTN wants a UUID reference; we keep it as the provider reference.
      const ref = crypto.randomUUID();
      await callJson(fetchFn, NAME, `${base}/collection/v1_0/requesttopay`, {
        method: "POST",
        headers: { ...headers, "x-reference-id": ref, "x-callback-url": charge.callbackUrl, "content-type": "application/json" },
        body: JSON.stringify({
          amount: String(charge.amount),
          currency,
          externalId: charge.paymentId,
          payer: { partyIdType: "MSISDN", partyId: charge.msisdn },
          payerMessage: charge.label.slice(0, 160),
          payeeNote: charge.label.slice(0, 160),
        }),
      });
      return { providerRef: ref, redirectUrl: null, message: "Check your phone and enter your MoMo PIN to approve." };
    },
    async check(providerRef) {
      const { base, headers } = await session();
      const json = await callJson(fetchFn, NAME, `${base}/collection/v1_0/requesttopay/${providerRef}`, { headers });
      const status = String(json["status"] ?? "PENDING");
      const amount = Number(json["amount"]);
      if (status === "SUCCESSFUL") return { status: "succeeded", amount: Number.isFinite(amount) ? amount : null, message: "Paid with MTN MoMo." };
      if (status === "FAILED") return { status: "failed", amount: null, message: `MTN MoMo: ${String(at(json, "reason") ?? "the payment was not approved")}.` };
      return { status: "pending", amount: null, message: null };
    },
    // MTN does not sign callbacks; `check` asks MTN itself.
    trustCallback: async () => true,
    paymentIdIn: (body) => (typeof at(body, "externalId") === "string" ? String(at(body, "externalId")) : null),
  };
}
