/**
 * Picks the push sender from the Worker's settings:
 * - `PUSH_SENDER=mock`: the recording mock (local development and tests);
 * - a valid `FCM_SERVICE_ACCOUNT` secret: real FCM;
 * - otherwise: the "not configured" sender, which sends nothing.
 *
 * When the Integrations Hub is built, the super admin's pasted key is passed
 * in as `serviceAccountJson` instead of the secret; nothing else changes.
 */

import type { PushSender } from "../application/ports/push-sender";
import { FcmHttpV1Sender } from "./fcm/fcm-http-v1-sender";
import { parseServiceAccount } from "./fcm/service-account";
import { MockPushSender } from "./memory/mock-push-sender";
import { NotConfiguredPushSender } from "./not-configured-push-sender";

/** The Worker settings this module reads. */
export interface PushEnv {
  /** Set to `mock` to never call Firebase. */
  PUSH_SENDER?: string;
  /** The whole service-account JSON file, as a Cloudflare secret. */
  FCM_SERVICE_ACCOUNT?: string;
}

/** The sender for [env]. */
export function createPushSender(env: PushEnv, fetcher: typeof fetch = fetch): PushSender {
  if (env.PUSH_SENDER === "mock") return new MockPushSender();
  const account = parseServiceAccount(env.FCM_SERVICE_ACCOUNT);
  return account ? new FcmHttpV1Sender(account, fetcher) : new NotConfiguredPushSender();
}
