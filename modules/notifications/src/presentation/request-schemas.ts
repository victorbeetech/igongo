/** Validation for every request body this module accepts. */

import { DEVICE_PLATFORMS, PUSH_CHANNELS } from "@igongo/contracts/notifications";
import { z } from "zod";

/** `POST /notifications/devices`. FCM tokens are long; cap them for safety. */
export const registerDeviceBody = z.object({
  token: z.string().min(20).max(4096),
  platform: z.enum(DEVICE_PLATFORMS),
});

/** The wording of a push sent by hand. Links must be app screens. */
const message = {
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(1000),
  channel: z.enum(PUSH_CHANNELS).default("general"),
  link: z.string().regex(/^\/(?!\/)[^\s\\]*$/).optional(),
};

/** `POST /notifications/push/test`. */
export const testPushBody = z.object({
  title: z.string().min(1).max(120).default("Igongo test notification"),
  body: z.string().min(1).max(1000).default("Push notifications are working."),
});

/** `POST /notifications/push/broadcast`. Topics follow FCM's naming rule. */
export const broadcastBody = z.object({
  ...message,
  target: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("users"), userIds: z.array(z.string().min(1)).min(1).max(5000) }),
    z.object({ kind: z.literal("roles"), roles: z.array(z.string().min(1)).min(1).max(200) }),
    z.object({ kind: z.literal("topic"), topic: z.string().regex(/^[a-zA-Z0-9-_.~%]{1,900}$/) }),
  ]),
});

/** `GET /notifications/inbox` query: a page size and the cursor from the last page. */
export const inboxQuery = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  // The cursor is read as a real time, so the repository compares dates, not text.
  before: z.iso
    .datetime()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined)),
});
