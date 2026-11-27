// The receipt email: the template's words, and the Resend sender (mocked HTTP).
// No real email is sent and no key is needed: the key is passed in by the test.

import { describe, expect, it, vi } from "vitest";
import type { Payment } from "../src/domain/payment";
import { escapeHtml, receiptEmail } from "../src/domain/receipt-email";
import { resendReceiptMailer, RESEND_ENDPOINT } from "../src/infrastructure/email/resend-receipt-mailer";

/** A settled payment for a booking, with a payer. */
function payment(over: Partial<Payment> = {}): Payment {
  return {
    id: "pay-1",
    module: "room-bookings",
    recordId: "bk-1",
    label: "Standard Room IGH20250428-001",
    outlet: null,
    method: "mtn_momo",
    amount: 360000,
    status: "succeeded",
    payerUserId: "user-1",
    payerPhone: null,
    providerRef: "ref",
    redirectUrl: null,
    message: null,
    recordedBy: null,
    refundedAmount: 0,
    createdAt: new Date("2025-04-28T08:00:00Z"),
    settledAt: new Date("2025-04-28T08:01:00Z"),
    ...over,
  };
}

/** A fetch that answers with [status]; the test can read its calls. */
function fakeFetch(status: number) {
  return vi.fn(async (...args: Parameters<typeof fetch>) => new Response(String(args.length), { status }));
}

describe("receipt email", () => {
  it("puts the booking number, amount and receipt number in the ticket order", () => {
    const e = receiptEmail(payment(), new Date("2025-04-28T08:01:00Z"));
    expect(e.subject).toBe("Igongo receipt Standard Room IGH20250428-001");
    expect(e.text).toContain("Booking number: Standard Room IGH20250428-001");
    expect(e.text).toContain("Amount paid: UGX 360000");
    expect(e.text).toContain("Receipt number: pay-1");
    expect(e.html).toContain("<strong>Standard Room IGH20250428-001</strong>");
  });

  it("escapes values put into the HTML", () => {
    expect(escapeHtml(`<b>"Tom & Jerry's"</b>`)).toBe("&lt;b&gt;&quot;Tom &amp; Jerry&#39;s&quot;&lt;/b&gt;");
    const e = receiptEmail(payment({ label: "<script>x</script>" }), new Date());
    expect(e.html).not.toContain("<script>");
  });
});

describe("Resend receipt mailer", () => {
  const emailOf = async () => "guest@example.com";
  const sender = "Igongo <r@example.com>";

  it("sends nothing and says why when the key is not set", async () => {
    const send = fakeFetch(200);
    const mailer = resendReceiptMailer({ apiKey: async () => undefined, from: async () => sender, emailOf, fetch: send });
    expect(await mailer.sendReceipt(payment())).toEqual({ sent: false, reason: "RESEND_API_KEY is not set" });
    expect(send).not.toHaveBeenCalled();
  });

  it("sends nothing until the sender address is set", async () => {
    const send = fakeFetch(200);
    const mailer = resendReceiptMailer({ apiKey: async () => "test-key", from: async () => null, emailOf, fetch: send });
    expect(await mailer.sendReceipt(payment())).toEqual({ sent: false, reason: "RECEIPT_FROM is not set" });
    expect(send).not.toHaveBeenCalled();
  });

  it("skips a payment with no payer account or no address on file", async () => {
    const send = fakeFetch(200);
    const noPayer = resendReceiptMailer({ apiKey: async () => "test-key", from: async () => sender, emailOf, fetch: send });
    expect(await noPayer.sendReceipt(payment({ payerUserId: null }))).toEqual({ sent: false, reason: "no payer account" });
    const noAddress = resendReceiptMailer({ apiKey: async () => "test-key", from: async () => sender, emailOf: async () => null, fetch: send });
    expect(await noAddress.sendReceipt(payment())).toEqual({ sent: false, reason: "payer has no email address" });
    expect(send).not.toHaveBeenCalled();
  });

  it("posts the receipt to Resend with the key as a bearer token", async () => {
    const send = fakeFetch(200);
    const mailer = resendReceiptMailer({ apiKey: async () => "test-key", from: async () => sender, emailOf, fetch: send });
    expect(await mailer.sendReceipt(payment())).toEqual({ sent: true });
    expect(send).toHaveBeenCalledTimes(1);
    const [url, init] = send.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RESEND_ENDPOINT);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    const body = JSON.parse(String(init.body)) as { from: string; to: string[]; subject: string };
    expect(body.from).toBe(sender);
    expect(body.to).toEqual(["guest@example.com"]);
    expect(body.subject).toContain("Standard Room");
  });

  it("reports a refusal without throwing", async () => {
    const mailer = resendReceiptMailer({ apiKey: async () => "test-key", from: async () => sender, emailOf, fetch: fakeFetch(422) });
    expect(await mailer.sendReceipt(payment())).toEqual({ sent: false, reason: "Resend refused the receipt (422)" });
  });

  it("reports a network error without throwing", async () => {
    const mailer = resendReceiptMailer({
      apiKey: async () => "test-key",
      from: async () => sender,
      emailOf,
      fetch: vi.fn((): Promise<Response> => Promise.reject(new Error("offline"))),
    });
    expect(await mailer.sendReceipt(payment())).toEqual({ sent: false, reason: "Resend could not be reached: offline" });
  });
});
