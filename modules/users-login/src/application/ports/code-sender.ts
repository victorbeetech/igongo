/**
 * Sends one-time codes and sign-in links. Africa's Talking (SMS) and Meta
 * (WhatsApp) come later; email uses Resend, once its key and sender are set.
 * Until a channel is set up, the gateway gives a sender that refuses with
 * `not_configured`.
 */

export type CodeChannel = "sms" | "whatsapp" | "email";

export interface CodeSender {
  /** Sends [message] to [to] (a phone number or email) over [channel]. */
  send(channel: CodeChannel, to: string, message: string): Promise<void>;
  /**
   * True when [channel] is set up (its provider and keys are present), so sending can work.
   * Async because the keys are read from the super admin's stored secrets at check time.
   */
  ready(channel: CodeChannel): Promise<boolean>;
}
