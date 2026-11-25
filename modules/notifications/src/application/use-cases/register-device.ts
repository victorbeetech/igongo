/** Use case: save the signed-in person's push token and tell the phone its topics. */

import type { RegisterDeviceRequest, RegisterDeviceResponse } from "@igongo/contracts/notifications";
import { broadcastTopics } from "../../domain/broadcast-topics";
import type { DeviceTokenRepository } from "../ports/device-token-repository";

/** Who is signed in, as the gateway's auth middleware gives it. */
export interface Actor {
  /** The person's user ID. */
  userId: string;
  /** True for staff accounts, false for clients. */
  isStaff: boolean;
}

/**
 * Saves the token and returns the broadcast topics the phone should join.
 * Registering the same token again just refreshes it, so the app can call
 * this at every start.
 */
export async function registerDevice(
  deps: { repo: DeviceTokenRepository; now: () => Date },
  actor: Actor,
  request: RegisterDeviceRequest,
): Promise<RegisterDeviceResponse> {
  // 1. Save or refresh the token for this person.
  await deps.repo.upsert({ token: request.token, userId: actor.userId, platform: request.platform, now: deps.now() });
  // 2. The server, not the phone, decides the topics (see broadcast-topics.ts).
  return { topics: broadcastTopics(actor) };
}
