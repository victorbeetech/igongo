/**
 * Permission keys Users & Login checks. The super admin gives them to roles.
 *
 * Everything that decides who is staff, or how anyone signs in, uses the
 * `approve` action, which only the Super Admin role holds by default: making
 * staff accounts, the staff match, and the sign-in and security settings.
 */

export const USER_PERMISSIONS = {
  viewAccounts: "users-login.accounts.view",
  createAccounts: "users-login.staff-accounts.approve",
  editAccounts: "users-login.accounts.edit",
  revokeSessions: "users-login.sessions.delete",
  viewMethods: "users-login.methods.view",
  editMethods: "users-login.security.approve",
  matchStaff: "users-login.staff-match.approve",
} as const;
