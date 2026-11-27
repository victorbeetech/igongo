/**
 * The Notifications module (module 10) of the Igongo API. The gateway imports
 * only this file. See modules/notifications/README.md.
 */

export { dispatchEvent } from "./application/use-cases/dispatch-event";
export { listInbox } from "./application/use-cases/list-inbox";
export { recordInboxItems, type InboxMessage } from "./application/use-cases/record-inbox-items";
export type { InboxRepository } from "./application/ports/inbox-repository";
export { sendPush } from "./application/use-cases/send-push";
export type { InboxItem } from "./domain/inbox-item";
export type { InboxPage } from "./domain/inbox-page";
export type { NotificationRule } from "./domain/notification-rule";
export type { PushPayload } from "./domain/push-payload";
export type { PushResult } from "./domain/push-result";
export type { PushTarget } from "./domain/push-target";
export { createPushSender, type PushEnv } from "./infrastructure/create-push-sender";
export { DrizzleDeviceTokenRepository, type NotificationsDb } from "./infrastructure/db/drizzle-device-token-repository";
export { DrizzleInboxRepository } from "./infrastructure/db/drizzle-inbox-repository";
export { MemoryInboxRepository } from "./infrastructure/memory/memory-inbox-repository";
export { MemoryAudienceDirectory } from "./infrastructure/memory/memory-audience-directory";
export { MockPushSender } from "./infrastructure/memory/mock-push-sender";
export { notificationsRouter, type NotificationsDeps } from "./presentation/notifications-router";
export { PERMISSIONS, type RequestActor } from "./presentation/request-actor";
