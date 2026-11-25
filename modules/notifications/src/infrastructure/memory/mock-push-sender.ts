/**
 * A push sender that sends nothing and records every push, for tests and for
 * local development (`PUSH_SENDER=mock`). Tokens starting with `dead-` act
 * like tokens FCM reports as unregistered.
 */

import type { PushSender } from "../../application/ports/push-sender";
import type { PushPayload } from "../../domain/push-payload";
import type { PushResult } from "../../domain/push-result";

/** One recorded push. */
export interface RecordedPush {
  to: string;
  payload: PushPayload;
}

/** `PushSender` that only records. */
export class MockPushSender implements PushSender {
  /** Every push "sent", in order. */
  readonly sent: RecordedPush[] = [];

  async sendToTokens(tokens: string[], payload: PushPayload): Promise<PushResult[]> {
    return tokens.map((token) => {
      if (token.startsWith("dead-")) return { target: token, outcome: "invalid_token", detail: "UNREGISTERED" };
      this.sent.push({ to: token, payload });
      return { target: token, outcome: "sent", detail: `mock/${this.sent.length}` };
    });
  }

  async sendToTopic(topic: string, payload: PushPayload): Promise<PushResult> {
    this.sent.push({ to: `topic:${topic}`, payload });
    return { target: `topic:${topic}`, outcome: "sent", detail: `mock/${this.sent.length}` };
  }
}
