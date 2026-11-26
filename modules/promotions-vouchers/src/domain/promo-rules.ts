/**
 * The pure rules for using a promo or voucher code at a checkout. They read
 * the records the super admin keeps in this module:
 *   - a Promotion (status "Live") with a Promo code, a Discount (%), "Where
 *     it works" and an end date: reusable, takes a percent off;
 *   - a Voucher or gift card (status "Issued", code such as PV-0042) with a
 *     Value (UGX) and an expiry: used once, takes its value off.
 * Field and status keys are the starting set-up's; if the super admin
 * renames a field's label the key stays, so these keep working.
 */

import type { PromoContext, PromoQuote } from "@igongo/contracts/promotions-vouchers";
import type { WorkRecord } from "@igongo/records-kit";

/** Status keys these rules rely on. */
export const PROMO_STATUS = { live: "live", issued: "issued", redeemed: "redeemed" } as const;

/** A code as typed, trimmed and in capitals, so "easter10 " and "EASTER10" match. */
export const normalCode = (code: string) => code.trim().toUpperCase();

/** True when the date field [value] (YYYY-MM-DD) is empty or today or later. */
const notPast = (value: unknown, today: string) => typeof value !== "string" || value === "" || value >= today;

/**
 * True when "Where it works" allows [context]. Empty, "all" or "everywhere"
 * work everywhere; otherwise any listed word must match the module (such as
 * "food") or the outlet key (such as "main").
 */
export function worksHere(where: unknown, context: PromoContext): boolean {
  const words = typeof where === "string" ? where.toLowerCase().split(/[\s,;/]+/).filter(Boolean) : [];
  if (!words.length || words.includes("all") || words.includes("everywhere")) return true;
  const places = [context.module, ...context.module.split("-"), ...(context.outlet ? [context.outlet] : [])];
  return words.some((w) => places.includes(w));
}

/** The quote for a live promotion [record] on [context], or null when it does not apply today. */
export function promotionQuote(record: WorkRecord, context: PromoContext, today: string): PromoQuote | null {
  const percent = Number(record.fields["discount"] ?? 0);
  if (record.status !== PROMO_STATUS.live || !(percent > 0 && percent <= 100)) return null;
  if (!notPast(record.fields["ends"], today) || !worksHere(record.fields["where"], context)) return null;
  return { code: normalCode(String(record.fields["code"])), label: `${record.title} (${percent}% off)`, discount: Math.floor((context.subtotal * percent) / 100), kind: "promotion" };
}

/** The quote for an issued voucher [record] on [context], or null when it is used, cancelled or expired. */
export function voucherQuote(record: WorkRecord, context: PromoContext, today: string): PromoQuote | null {
  const value = Number(record.fields["value"] ?? 0);
  if (record.status !== PROMO_STATUS.issued || !(value > 0) || !notPast(record.fields["expires"], today)) return null;
  // A voucher is used up in one go; anything over the bill is not kept.
  return { code: record.code, label: `Voucher ${record.code}`, discount: Math.min(value, context.subtotal), kind: "voucher" };
}
