/**
 * Sends one-time codes and sign-in links. Africa's Talking (SMS), Meta
 * (WhatsApp) and Resend (email) come later; until their keys are set the
 * gateway gives a sender that refuses with `not_configured`.
 */

export type CodeChannel = "sms" | "whatsapp" | "email";

export interface CodeSender {
  /** Sends [message] to [to] (a phone number or email) over [channel]. */
  send(channel: CodeChannel, to: string, message: string): Promise<void>;
  /** True when [channel] is set up (a provider and its keys), so sending can work. */
  ready(channel: CodeChannel): boolean;
}
