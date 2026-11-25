/**
 * @igongo/core: shared building blocks for every API module.
 * Modules import only from here, never from each other.
 */

export { hasPermission, permissionMatches } from "./access/permission-matches";
export { scopeOf } from "./access/scope-of";
export { scopeReaches, staffScope, type ScopeSelf, type StaffScope } from "./access/staff-scope";
export { HOTEL_TIME_ZONE, hotelDate, hotelTime } from "./time/hotel-date";
export { fromBase64, toBase64 } from "./crypto/base64";
export { hashPassword, verifyPassword } from "./crypto/password-hasher";
export { SecretBox } from "./crypto/secret-box";
export { sha256Hex } from "./crypto/sha256-hex";
export type { Database } from "./db/database";
export { ModuleSettings, moduleSettingsTable, type ModuleSettingsTable } from "./db/module-settings";
export { AppError, type AppErrorCode } from "./errors/app-error";
export { newId } from "./ids/new-id";
export { normalizeUid } from "./nfc/normalize-uid";
export { createLogger, type Logger, type LogLevel } from "./logging/logger";
export type { ActorEnv, ActorVariables } from "./http/actor-env";
export { actorOf, can, requirePermission, requireSignIn } from "./http/guards";
export { recordChange, type ChangeContext, type ChangeEntry } from "./audit/change-context";
