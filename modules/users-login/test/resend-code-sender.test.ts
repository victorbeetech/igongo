// The Resend email sender for codes and reset links. Mocked HTTP: no real email is sent.

import { describe, expect, it, vi } from "vitest";
import { DEFAULT_EMAIL_SENDER, resendCodeSender, RESEND_SEND_ENDPOINT } from "../src/infrastructure/senders/resend-code-sender";

const okFetch = () => vi.fn(async () => new Response("{}", { status: 200 }));

describe("Resend code sender", () => {
  it("is not ready until both the key and the sender are set", async () => {
    expect(await resendCodeSender({ apiKey: async () => null, from: async () => "Igongo <a@b.c>" }).ready("email")).toBe(false);
    expect(await resendCodeSender({ apiKey: async () => "k", from: async () => null }).ready("email")).toBe(false);
    expect(await resendCodeSender({ apiKey: async () => "k", from: async () => "Igongo <a@b.c>" }).ready("email")).toBe(true);
  });

  it("uses the verified igongo.victorbee.com default sender", async () => {
    expect(DEFAULT_EMAIL_SENDER).toBe("Igongo <no-reply@igongo.victorbee.com>");
  });

  it("is never ready for SMS or WhatsApp", async () => {
    const s = resendCodeSender({ apiKey: async () => "k", from: async () => "Igongo <a@b.c>" });
    expect(await s.ready("sms")).toBe(false);
    expect(await s.ready("whatsapp")).toBe(false);
  });

  it("posts the email to Resend with the key as a bearer token", async () => {
    const send = okFetch();
    const s = resendCodeSender({ apiKey: async () => "test-key", from: async () => "Igongo <a@b.c>", fetch: send });
    await s.send("email", "guest@example.com", "Reset your Igongo password: https://x/reset");
    const [url, init] = send.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(RESEND_SEND_ENDPOINT);
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    const body = JSON.parse(String(init.body)) as { from: string; to: string[]; text: string };
    expect(body).toMatchObject({ from: "Igongo <a@b.c>", to: ["guest@example.com"], text: "Reset your Igongo password: https://x/reset" });
  });

  it("refuses to send when the key or sender is missing, and never calls Resend", async () => {
    const send = okFetch();
    const s = resendCodeSender({ apiKey: async () => null, from: async () => "Igongo <a@b.c>", fetch: send });
    await expect(s.send("email", "guest@example.com", "x")).rejects.toMatchObject({ code: "not_configured" });
    expect(send).not.toHaveBeenCalled();
  });

  it("refuses SMS and WhatsApp as not set up", async () => {
    const send = okFetch();
    const s = resendCodeSender({ apiKey: async () => "k", from: async () => "Igongo <a@b.c>", fetch: send });
    await expect(s.send("sms", "+2550000", "x")).rejects.toMatchObject({ code: "not_configured" });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports a Resend refusal without the key or address", async () => {
    const s = resendCodeSender({ apiKey: async () => "test-key", from: async () => "Igongo <a@b.c>", fetch: vi.fn(async () => new Response("no", { status: 422 })) });
    await expect(s.send("email", "guest@example.com", "x")).rejects.toThrow("Resend refused the email (422).");
  });
});
