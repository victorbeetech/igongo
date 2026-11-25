/** Permission keys Users & Login checks. The super admin gives them to roles. */

export const USER_PERMISSIONS = {
  viewAccounts: "users-login.accounts.view",
  createAccounts: "users-login.accounts.create",
  editAccounts: "users-login.accounts.edit",
  revokeSessions: "users-login.sessions.delete",
  viewMethods: "users-login.methods.view",
  editMethods: "users-login.methods.edit",
} as const;
