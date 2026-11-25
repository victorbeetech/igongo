/**
 * Use case: send one push to people, roles or a topic. Every other part of
 * the system that wants to send a push goes through here.
 */

import type { PushPayload } from "../../domain/push-payload";
import type { PushResult } from "../../domain/push-result";
import type { PushTarget } from "../../domain/push-target";
import type { AudienceDirectory } from "../ports/audience-directory";
import type { DeviceTokenRepository } from "../ports/device-token-repository";
import type { PushSender } from "../ports/push-sender";

/** What sending needs. */
export interface SendPushDeps {
  repo: DeviceTokenRepository;
  sender: PushSender;
  directory: AudienceDirectory;
}

/**
 * Sends [payload] to [target] and returns one result per token or topic.
 * Tokens FCM reports dead are deleted, so they are not tried again.
 */
export async function sendPush(deps: SendPushDeps, target: PushTarget, payload: PushPayload): Promise<PushResult[]> {
  // 1. A topic goes straight to FCM.
  if (target.kind === "topic") return [await deps.sender.sendToTopic(target.topic, payload)];

  // 2. Roles become people, on the server (never a topic: see push-target.ts).
  const userIds = target.kind === "roles" ? await deps.directory.usersWithRoles(target.roles) : target.userIds;
  if (userIds.length === 0) return [];

  // 3. People become their phones' tokens. Someone without the app gets
  //    nothing here; the in-app inbox still has the message.
  const tokens = [...new Set((await deps.repo.findByUsers([...new Set(userIds)])).map((t) => t.token))];
  if (tokens.length === 0) return [];

  // 4. Send, then delete every token FCM says is dead.
  const results = await deps.sender.sendToTokens(tokens, payload);
  const dead = results.filter((r) => r.outcome === "invalid_token").map((r) => r.target);
  if (dead.length > 0) await deps.repo.removeMany(dead);
  return results;
}
