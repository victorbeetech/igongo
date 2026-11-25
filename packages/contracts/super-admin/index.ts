/**
 * Public contract of the Super Admin Console (module 1): module switches and
 * stored integration keys, read by the gateway and other modules.
 */

/** Whether a module is on, and the message shown while it is down. */
export interface ModuleState {
  moduleKey: string;
  enabled: boolean;
  maintenance: boolean;
  message: string | null;
}

/** Reads module switches. Modules that cannot be switched off always read as on. */
export interface ModuleSwitchReader {
  stateOf(moduleKey: string): Promise<ModuleState>;
}

/** Reads decrypted integration keys, such as `google.client_secret`. Server side only. */
export interface SecretReader {
  /** The plain value, or null when the super admin has not set it. */
  get(key: string): Promise<string | null>;
}

/** Modules that can never be switched off (their specs say so). */
export const ALWAYS_ON_MODULES = ["super-admin", "roles-permissions", "users-login", "audit-trail"] as const;

/** Events this module emits. */
export const SUPER_ADMIN_EVENTS = {
  moduleEnabled: "module.enabled",
  moduleDisabled: "module.disabled",
  settingsChanged: "settings.changed",
} as const;
