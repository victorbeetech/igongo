/**
 * Public contract of Promotions, Vouchers & Gift Cards (module 59): checking
 * a promo or voucher code at a checkout, and using it up once the order is
 * placed. Selling modules (Food Ordering, later the shop) use this; they
 * never read the promotions tables.
 */

/** Where a code is being used, so the promotion's "Where it works" can be checked. */
export interface PromoContext {
  /** The selling module's key, such as `food-ordering`. */
  module: string;
  /** The outlet key, such as `main`, or null. */
  outlet: string | null;
  /** The cart's value before the discount, in whole shillings. */
  subtotal: number;
}

/** A code that works here, and how much it takes off. */
export interface PromoQuote {
  /** The code as the guest typed it, in capitals. */
  code: string;
  /** What the screens show, such as "Easter 10% off" or "Gift card PV-0042". */
  label: string;
  /** Shillings off this cart (never more than the subtotal). */
  discount: number;
  /** `promotion` (a percent, reusable) or `voucher` (a value, used once). */
  kind: "promotion" | "voucher";
}

/** What a selling module may ask of Promotions. Built by the gateway. */
export interface PromoDesk {
  /** The quote for [code] here, or null when the code is unknown, ended or not for this place. */
  check(code: string, context: PromoContext): Promise<PromoQuote | null>;
  /** Uses [code] up for the record [recordId] (vouchers become Redeemed; promotions stay live). */
  redeem(code: string, recordId: string): Promise<void>;
  /** Gives a voucher back when its order is cancelled. */
  release(code: string, recordId: string): Promise<void>;
}
