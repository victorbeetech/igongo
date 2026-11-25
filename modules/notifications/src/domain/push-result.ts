/** What happened to one push sent to one token or topic. */

/** The outcome of one send. */
export type PushOutcome =
  /** FCM accepted it; it will reach the phone when it is online. */
  | "sent"
  /** The token is dead (app removed or signed out); the token is deleted. */
  | "invalid_token"
  /** FCM refused or failed; the delivery log keeps the reason. */
  | "failed"
  /** No Firebase key is set yet, so nothing was sent. */
  | "not_configured";

/** The result for one token or topic. */
export interface PushResult {
  /** The token or `topic:<name>` the push went to. */
  target: string;
  /** What happened. */
  outcome: PushOutcome;
  /** FCM's message name when sent, or the error when not. */
  detail?: string;
}
