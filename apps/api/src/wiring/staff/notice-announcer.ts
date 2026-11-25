/**
 * Sends a push when a notice is published: to every staff phone (the
 * `staff` topic) when the post is for everyone, or to the holders of the
 * chosen roles. Uses the Notifications module (10); when Firebase has no
 * keys yet, its "not configured" sender quietly sends nothing.
 */

import type { NoticesDeps } from "@igongo/notice-board";
import { createPushSender, DrizzleDeviceTokenRepository, sendPush } from "@igongo/notifications";
import { newId, type Database } from "@igongo/core";
import type { Env } from "../../shell/env";

/** The announcer for one request. [holdersOf] finds the people holding role keys. */
export function noticeAnnouncer(db: Database, env: Env, holdersOf: (roles: string[]) => Promise<string[]>): NoticesDeps["announce"] {
  return async (notice) => {
    const deps = { repo: new DrizzleDeviceTokenRepository(db), sender: createPushSender(env), directory: { usersWithRoles: holdersOf } };
    const target = notice.audienceRoles.length ? { kind: "roles" as const, roles: notice.audienceRoles } : { kind: "topic" as const, topic: "staff" };
    await sendPush(deps, target, { notificationId: newId("ntf"), title: "Notice board", body: notice.title, channel: "general", link: `/notices/${notice.id}` });
  };
}
