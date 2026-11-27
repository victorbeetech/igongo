/**
 * The receipt email's words, laid out like an airline ticket: the booking
 * number is the large item, then the amount and the date. Pure text and HTML,
 * so it is easy to test and needs no template engine.
 */

import type { Payment } from "./payment";

/** The email's subject, text body and HTML body. */
export interface ReceiptEmail {
  subject: string;
  text: string;
  html: string;
}

/** Escapes [value] for safe use inside HTML. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Builds the receipt email for a settled [payment]. */
export function receiptEmail(payment: Payment, when: Date): ReceiptEmail {
  // Step 1: the words people read, in ticket order.
  const date = when.toISOString().slice(0, 10);
  const lines = [
    "IGONGO COUNTRY HOTEL & CULTURAL CENTRE",
    "PAYMENT RECEIPT",
    "",
    `Booking number: ${payment.label}`,
    `Amount paid: UGX ${payment.amount}`,
    `Paid by: ${payment.method}`,
    `Date: ${date}`,
    `Receipt number: ${payment.id}`,
    "",
    "Show your booking number or the QR code in the Igongo app at the door.",
  ];
  // Step 2: the same lines as HTML, every value escaped.
  const rows = [
    ["Booking number", payment.label],
    ["Amount paid", `UGX ${payment.amount}`],
    ["Paid by", payment.method],
    ["Date", date],
    ["Receipt number", payment.id],
  ]
    .map(([k, v]) => `<tr><td>${escapeHtml(k ?? "")}</td><td><strong>${escapeHtml(v ?? "")}</strong></td></tr>`)
    .join("");
  const html = `<div style="font-family:sans-serif"><h2>Igongo payment receipt</h2><table>${rows}</table><p>Show your booking number or the QR code in the Igongo app at the door.</p></div>`;
  return { subject: `Igongo receipt ${payment.label}`, text: lines.join("\n"), html };
}
