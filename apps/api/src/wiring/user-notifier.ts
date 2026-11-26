/**
 * The `UserNotifier` the gateway hands to modules that tell people about
 * their own things (order status, deliveries, chat): one push to every
 * phone of the given people, through Notifications (module 10).
 *
 * A push is never worth failing the change it reports, so a sending
 * problem is written to the logs (with the request ID, never the token)
 * and the request carries on. With no Firebase keys yet, the "not
 * configured" sender sends nothing.
 */

import type { UserNotifier } from "@igongo/contracts/notifications";
import { newId, type Database, type Logger } from "@igongo/core";
import { createPushSender, DrizzleDeviceTokenRepository, sendPush } from "@igongo/notifications";
import type { Env } from "../shell/env";

export function userNotifier(db: Database, env: Env, logger: Logger): UserNotifier {
  return async (userIds, message) => {
    const people = [...new Set(userIds)].filter(Boolean);
    if (!people.length) return;
    try {
      // Roles are never used here, so the directory has nobody to resolve.
      const deps = { repo: new DrizzleDeviceTokenRepository(db), sender: createPushSender(env), directory: { usersWithRoles: async () => [] } };
      await sendPush(deps, { kind: "users", userIds: people }, { notificationId: newId("ntf"), ...message });
    } catch (error) {
      logger.log("warn", "push not sent", { title: message.title, error: error instanceof Error ? error.message : String(error) });
    }
  };
}
