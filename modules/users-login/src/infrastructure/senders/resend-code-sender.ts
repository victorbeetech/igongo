/**
 * Sends email codes and reset links through Resend. Email is "ready" only when
 * both the API key and the sender address are present. Other channels (SMS,
 * WhatsApp) are refused as not set up, as before.
 */

import { AppError } from "@igongo/core";
import type { CodeChannel, CodeSender } from "../../application/ports/code-sender";

/** The Resend endpoint for sending one email. */
export const RESEND_SEND_ENDPOINT = "https://api.resend.com/emails";

/** The default sender for sign-in emails: the verified igongo.victorbee.com domain. The super admin can override it. */
export const DEFAULT_EMAIL_SENDER = "Igongo <no-reply@igongo.victorbee.com>";

/** What the email sender needs. Both are read at send time, so a change in the super admin's settings applies at once. */
export interface ResendCodeConfig {
  /** The API key: the super admin's setting first, else the RESEND_API_KEY secret. */
  apiKey: () => Promise<string | null | undefined>;
  /** The sender address, such as "Igongo <no-reply@yourdomain>". */
  from: () => Promise<string | null | undefined>;
  /** The HTTP function, injectable for tests. */
  fetch?: typeof fetch;
}

/** Builds the Resend-backed code sender for the sign-in system. */
export function resendCodeSender(config: ResendCodeConfig): CodeSender {
  return {
    async send(channel: CodeChannel, to: string, message: string) {
      // Only email goes through Resend; the other channels are not set up yet.
      if (channel !== "email") throw new AppError("not_configured", `Sending codes by ${channel} is not set up yet.`);
      const key = await config.apiKey();
      const from = await config.from();
      if (!key || !from) throw new AppError("not_configured", "Email is not set up yet.");
      const send = config.fetch ?? fetch;
      const res = await send(RESEND_SEND_ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], subject: "Your Igongo sign-in", text: message }),
      });
      // A refusal is reported without the key or the address, so nothing sensitive is logged.
      if (!res.ok) throw new AppError("internal_error", `Resend refused the email (${res.status}).`);
    },
    async ready(channel: CodeChannel) {
      if (channel !== "email") return false;
      return Boolean((await config.apiKey()) && (await config.from()));
    },
  };
}
