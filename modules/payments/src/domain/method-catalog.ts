/**
 * What each payment method is, for the screens and the rules:
 *   prompt:   a mobile money prompt on the payer's phone (needs a number);
 *   redirect: a card checkout page at the provider;
 *   staff:    recorded by staff at a till (cash, bank, room charge, account).
 */

import type { PaymentMethod } from "@igongo/contracts/payments";

export type MethodKind = "prompt" | "redirect" | "staff";

export interface MethodInfo {
  method: PaymentMethod;
  name: string;
  kind: MethodKind;
}

export const METHOD_CATALOG: Record<PaymentMethod, MethodInfo> = {
  mtn_momo: { method: "mtn_momo", name: "MTN Mobile Money", kind: "prompt" },
  airtel_money: { method: "airtel_money", name: "Airtel Money", kind: "prompt" },
  card: { method: "card", name: "Card (Flutterwave)", kind: "redirect" },
  bank_transfer: { method: "bank_transfer", name: "Bank transfer", kind: "staff" },
  cash: { method: "cash", name: "Cash", kind: "staff" },
  room_charge: { method: "room_charge", name: "Charge to room", kind: "staff" },
  corporate_account: { method: "corporate_account", name: "Corporate account", kind: "staff" },
};
