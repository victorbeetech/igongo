/** What the Better Auth set-up needs: its settings and the stores behind it. */

import type { AuditRecorder } from "@igongo/contracts/audit-trail";
import type { AccessReader, RoleAssigner } from "@igongo/contracts/roles-permissions";
import type { Database } from "@igongo/core";
import type { AccountStore } from "../../application/ports/account-store";
import type { CardDirectory } from "../../application/ports/card-directory";
import type { CodeSender } from "../../application/ports/code-sender";
import type { LoginSettingsStore } from "../../application/ports/login-settings-store";
import type { FailedLoginStore } from "../../application/ports/failed-login-store";
import type { KnownDeviceStore } from "../../application/ports/known-device-store";
import type { PinStore } from "../../application/ports/pin-store";
import type { SecurityAlerts } from "../../application/ports/security-alerts";
import type { AppleKeys } from "./apple-client-secret";

/** Settings from the Worker's environment and the super admin's keys. */
export interface AuthConfig {
  /** The API's own address, such as https://igongo-api.victorbee.com. */
  baseURL: string;
  /** Better Auth's signing secret (Worker secret `BETTER_AUTH_SECRET`). */
  secret: string;
  /** Web addresses allowed to call the API with cookies. */
  trustedOrigins: string[];
  google: { clientId: string; clientSecret: string } | null;
  apple: (AppleKeys & { appBundleIdentifier?: string }) | null;
}

/** The stores and services, built per request by the gateway. */
export interface AuthDeps {
  db: Database;
  settings: LoginSettingsStore;
  accounts: AccountStore;
  access: AccessReader & RoleAssigner;
  pins: PinStore;
  cards: CardDirectory;
  codes: CodeSender;
  audit: AuditRecorder;
  /** Wrong-password counts, for the lockout. */
  failedLogins: FailedLoginStore;
  /** Devices each account used, for new-device alerts. */
  devices: KnownDeviceStore;
  alerts: SecurityAlerts;
  /** The owner's email for the one-time set-up (Worker secret). */
  bootstrapEmail: string | undefined;
}
