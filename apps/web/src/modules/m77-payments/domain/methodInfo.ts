// A payment method as the API describes it: prompt (mobile money on the
// payer's phone), redirect (card page) or staff (recorded at a till).

export interface MethodInfo {
  method: string;
  name: string;
  kind: "prompt" | "redirect" | "staff";
}

/** The method switches, as saved (S77-06). */
export interface MethodSettings {
  methods: Record<string, { enabled: boolean; outlets: string[]; modules: string[] }>;
  allowManual: boolean;
  environment: "sandbox" | "live";
}

/** Each method's name and the provider whose keys it needs on Connection settings. */
export const METHOD_NAMES: Record<string, { name: string; provider: string | null }> = {
  mtn_momo: { name: "MTN Mobile Money", provider: "mtn-momo" },
  airtel_money: { name: "Airtel Money", provider: "airtel-money" },
  card: { name: "Card (Flutterwave)", provider: "flutterwave" },
  bank_transfer: { name: "Bank transfer", provider: null },
  cash: { name: "Cash", provider: null },
  room_charge: { name: "Charge to room", provider: null },
  corporate_account: { name: "Corporate account", provider: null },
};
