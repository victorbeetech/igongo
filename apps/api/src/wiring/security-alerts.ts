/**
 * The `SecurityAlerts` Users & Login uses (new device, method linked or
 * removed). Each alert goes:
 *
 * - to the person by email when the email service is set up (Phase 8), and
 *   always as a push to their own phones;
 * - to every super admin as a push, for staff alerts.
 *
 * An alert never fails the sign-in it reports. Until email is set up the
 * "not configured" answer is written to the log (never the message's
 * secrets: alerts hold none) and the push still goes.
 */

import { SUPER_ADMIN_ROLE_KEY, type AccessReader } from "@igongo/contracts/roles-permissions";
import type { UserNotifier } from "@igongo/contracts/notifications";
import { AppError, type Logger } from "@igongo/core";
import type { CodeSender, SecurityAlerts } from "@igongo/users-login";

export function securityAlerts(email: CodeSender, push: UserNotifier, access: AccessReader, logger: Logger): SecurityAlerts {
  return {
    async toPerson(person, message) {
      try {
        await email.send("email", person.email, message);
      } catch (error) {
        // Only "email not set up yet" is expected; anything else is a real failure.
        if (!(error instanceof AppError && error.code === "not_configured")) throw error;
        logger.log("warn", "security alert email not sent: email is not set up", { userId: person.userId });
      }
      await push([person.userId], { title: "Igongo account security", body: message, channel: "urgent" });
    },
    async toSuperAdmins(message) {
      await push(await access.holdersOf([SUPER_ADMIN_ROLE_KEY]), { title: "Security alert", body: message, channel: "urgent" });
    },
  };
}
