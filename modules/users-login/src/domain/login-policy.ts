/**
 * Login and security rules the super admin sets on the Security settings
 * screen, with their defaults. Every rule is enforced on the server.
 */

/** The roles that hold money or personal data: payroll, finance, HR, the top team. */
export const DEFAULT_SENSITIVE_ROLE_KEYS = [
  "accountant",
  "assistant-gm",
  "board-of-directors",
  "ceo",
  "finance-manager",
  "general-manager",
  "hr-manager",
  "it-manager",
  "payroll-officer",
  "senior-manager",
  "system-auditor",
];

export interface LoginPolicy {
  /** Guests may create their own accounts in the app. */
  allowSelfRegistration: boolean;
  /** Guests may delete their own account in the app. Off: the server refuses it and the app hides the button. */
  allowSelfDelete: boolean;
  /** Guests see the Sign Out button in the app. Off: the app hides it (sessions still end on their own). */
  allowSignOut: boolean;
  /** New self-registered and Google/Apple accounts wait for approval. */
  newAccountsNeedApproval: boolean;
  /** Days an app session lasts without use. */
  sessionDays: number;
  /** The method the login screen shows first. */
  firstMethod: string;
  /** Passwords: the shortest allowed, and whether a letter and a number are needed. */
  passwordMinLength: number;
  passwordNeedsLetterAndNumber: boolean;
  /** Wrong passwords in a row before the email is locked, and for how long. */
  maxFailedAttempts: number;
  lockoutMinutes: number;
  /** Hours a staff sign-in on the web portal lasts, however busy. */
  staffWebSessionHours: number;
  /** Minutes without a click before the web portal signs out (shared gate and reception PCs). */
  webIdleMinutes: number;
  /** When on, staff in [sensitiveRoleKeys] must use email, password and 2-step, like the super admin. */
  twoFactorForSensitiveRoles: boolean;
  sensitiveRoleKeys: string[];
  /** Tell the person and the super admins when an account signs in on a new device. */
  newDeviceAlerts: boolean;
}

export const DEFAULT_LOGIN_POLICY: LoginPolicy = {
  allowSelfRegistration: true,
  allowSelfDelete: true,
  allowSignOut: true,
  newAccountsNeedApproval: false,
  sessionDays: 30,
  firstMethod: "email_password",
  passwordMinLength: 8,
  passwordNeedsLetterAndNumber: true,
  maxFailedAttempts: 5,
  lockoutMinutes: 15,
  staffWebSessionHours: 12,
  webIdleMinutes: 15,
  twoFactorForSensitiveRoles: false,
  sensitiveRoleKeys: DEFAULT_SENSITIVE_ROLE_KEYS,
  newDeviceAlerts: true,
};
