/**
 * The real push sender: Firebase Cloud Messaging's HTTP v1 API, called with
 * `fetch` from the Worker. FCM v1 sends one message per request, so tokens
 * are sent in small parallel batches.
 */

import type { PushSender } from "../../application/ports/push-sender";
import type { PushPayload } from "../../domain/push-payload";
import type { PushResult } from "../../domain/push-result";
import { fcmFailure } from "./fcm-error";
import { fcmMessage } from "./fcm-message";
import { googleAccessToken } from "./google-access-token";
import type { ServiceAccount } from "./service-account";

/** How many sends run at once. Workers allow six open connections per request. */
const BATCH_SIZE = 6;

/** `PushSender` on FCM HTTP v1. */
export class FcmHttpV1Sender implements PushSender {
  /**
   * @param account the service-account key (never logged).
   * @param fetcher `fetch`, replaceable in tests.
   */
  constructor(
    private readonly account: ServiceAccount,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  async sendToTokens(tokens: string[], payload: PushPayload): Promise<PushResult[]> {
    const results: PushResult[] = [];
    for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
      const batch = tokens.slice(i, i + BATCH_SIZE);
      results.push(...(await Promise.all(batch.map((token) => this.send({ token }, token, payload)))));
    }
    return results;
  }

  sendToTopic(topic: string, payload: PushPayload): Promise<PushResult> {
    return this.send({ topic }, `topic:${topic}`, payload);
  }

  /** Sends one message and turns the answer into a result. Never throws. */
  private async send(to: { token: string } | { topic: string }, target: string, payload: PushPayload): Promise<PushResult> {
    try {
      // 1. An access token for this key (cached for about an hour).
      const accessToken = await googleAccessToken(this.account, this.fetcher);

      // 2. Send the message.
      const response = await this.fetcher(
        `https://fcm.googleapis.com/v1/projects/${this.account.project_id}/messages:send`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
          body: JSON.stringify({ message: fcmMessage(payload, to) }),
        },
      );

      // 3. Success gives the message name; failure says why.
      const body: unknown = await response.json().catch(() => null);
      if (response.ok) return { target, outcome: "sent", detail: (body as { name?: string } | null)?.name ?? "" };
      return { target, ...fcmFailure(response.status, body) };
    } catch (error) {
      // No network, or Google refused the key.
      return { target, outcome: "failed", detail: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
