// Every payment method the system is built for. Each has its own switch for
// the whole system, then per outlet; the gateway ones need only their keys,
// pasted on Integrations > Connection settings.

import type { PaymentMethod } from "./paymentMethod";

/** Every payment method, with sample switch positions. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: "MTN Mobile Money", how: "A prompt on the payer's phone", provider: "mtn-momo", on: false },
  { name: "Airtel Money", how: "A prompt on the payer's phone", provider: "airtel-money", on: false },
  { name: "Card (Flutterwave)", how: "Visa and Mastercard, online and by link", provider: "flutterwave", on: false },
  { name: "Cash", how: "Recorded by staff at the till", provider: null, on: true },
  { name: "Bank transfer", how: "Recorded when the money arrives", provider: null, on: true },
  { name: "Charge to room", how: "Added to the guest's bill", provider: null, on: true },
  { name: "Corporate account", how: "Invoiced to the company", provider: null, on: true },
];

/** The outlets each method can be switched on for. */
export const OUTLETS = ["Reception", "Restaurant", "Delivery", "Museum", "Pool", "Crafts shop", "Events"];
