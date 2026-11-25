/** Login rules the super admin sets, with their defaults. */

export interface LoginPolicy {
  /** Clients may create their own accounts. */
  allowSelfRegistration: boolean;
  /** New self-registered and Google/Apple accounts wait for approval. */
  newAccountsNeedApproval: boolean;
  /** Days a session lasts without use. */
  sessionDays: number;
  /** The method the login screen shows first. */
  firstMethod: string;
}

export const DEFAULT_LOGIN_POLICY: LoginPolicy = {
  allowSelfRegistration: true,
  newAccountsNeedApproval: false,
  sessionDays: 30,
  firstMethod: "email_password",
};
