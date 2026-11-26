/**
 * The Users, Accounts & Login module (module 4) of the Igongo API. The
 * gateway imports only this file. See modules/users-login/README.md.
 */

export type { CodeSender } from "./application/ports/code-sender";
export type { CardDirectory } from "./application/ports/card-directory";
export { AUTH_BASE_PATH, createAuth, type Auth } from "./infrastructure/auth/create-auth";
export type { AuthConfig, AuthDeps } from "./infrastructure/auth/auth-deps";
export type { AppleKeys } from "./infrastructure/auth/apple-client-secret";
export { DrizzleAccountStore } from "./infrastructure/db/drizzle-account-store";
export { DrizzleFailedLoginStore } from "./infrastructure/db/drizzle-failed-login-store";
export { DrizzleKnownDeviceStore } from "./infrastructure/db/drizzle-known-device-store";
export { DrizzleLoginSettingsStore } from "./infrastructure/db/drizzle-login-settings-store";
export { DrizzlePinStore } from "./infrastructure/db/drizzle-pin-store";
export { notConfiguredCardDirectory, notConfiguredCodeSender } from "./infrastructure/senders/not-configured";
export { loginMethodsRouter } from "./presentation/login-methods-router";
export { USER_PERMISSIONS } from "./presentation/permissions";
export { securityRouter } from "./presentation/security-router";
export { setupRouter } from "./presentation/setup-router";
export type { SecurityAlerts } from "./application/ports/security-alerts";
export { requestGate, type GateVerdict } from "./domain/request-gate";
export { surfaceOf } from "./domain/request-surface";
export { isOwnerSettingUp } from "./application/use-cases/claim-first-super-admin";
export type { LoginPolicy } from "./domain/login-policy";
export type { UsersDeps } from "./presentation/users-deps";
export { usersRouter } from "./presentation/users-router";
