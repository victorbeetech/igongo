/**
 * Who is calling, as the API gateway's auth middleware (Users & Login and
 * Roles & Permissions) puts it on the request. This module trusts only that,
 * never IDs sent in the request body.
 */

/** The signed-in caller. */
export interface RequestActor {
  /** The person's user ID. */
  userId: string;
  /** True for staff accounts, false for clients. */
  isStaff: boolean;
  /** Permission keys the person's roles give, such as `notifications.push.test`. */
  permissions: string[];
}

/** The Hono context variables this module reads. */
export interface NotificationsVariables {
  actor: RequestActor | undefined;
}

/** Permission keys this module checks. The super admin gives them to roles. */
export const PERMISSIONS = {
  /** Send a test push to your own phones (Integrations > Firebase). */
  testPush: "notifications.push.test",
  /** Send a broadcast to people, roles or a topic. */
  broadcast: "notifications.broadcast.send",
} as const;
