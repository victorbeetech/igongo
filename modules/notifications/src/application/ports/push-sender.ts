/** Port: the service that delivers pushes (FCM in production, a mock in tests). */

import type { PushPayload } from "../../domain/push-payload";
import type { PushResult } from "../../domain/push-result";

/** Sends one push to tokens or to a topic. */
export interface PushSender {
  /** Sends [payload] to each of [tokens] and returns one result per token. */
  sendToTokens(tokens: string[], payload: PushPayload): Promise<PushResult[]>;
  /** Sends [payload] to everyone in [topic]. */
  sendToTopic(topic: string, payload: PushPayload): Promise<PushResult>;
}
