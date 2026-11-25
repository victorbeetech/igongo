/**
 * The push sender used until a Firebase key is set. It sends nothing and says
 * so in every result, so the delivery log shows why pushes did not go out and
 * nothing else in the system breaks.
 */

import type { PushSender } from "../application/ports/push-sender";
import type { PushResult } from "../domain/push-result";

/** Why nothing was sent. */
const DETAIL = "No Firebase service-account key is set (docs/NEEDS-YOU.md)";

/** `PushSender` for a system with no Firebase key yet. */
export class NotConfiguredPushSender implements PushSender {
  async sendToTokens(tokens: string[]): Promise<PushResult[]> {
    return tokens.map((target) => ({ target, outcome: "not_configured", detail: DETAIL }));
  }

  async sendToTopic(topic: string): Promise<PushResult> {
    return { target: `topic:${topic}`, outcome: "not_configured", detail: DETAIL };
  }
}
