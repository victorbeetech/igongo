/**
 * Sends security alerts: to the person (email) and to the super admins
 * (push). The gateway implements it with the email service and the push
 * notifier; when email is not set up yet, it records that in the Audit Trail.
 */

export interface SecurityAlerts {
  /** Tells the account holder, such as "Google was linked to your account". */
  toPerson(person: { userId: string; email: string }, message: string): Promise<void>;
  /** Tells every super admin, such as "Sam signed in on a new device". */
  toSuperAdmins(message: string): Promise<void>;
}
