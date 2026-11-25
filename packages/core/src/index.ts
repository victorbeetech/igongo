/**
 * @igongo/core: shared building blocks for every API module.
 * Modules import only from here, never from each other.
 */

export { hasPermission, permissionMatches } from "./access/permission-matches";
export { fromBase64, toBase64 } from "./crypto/base64";
export { hashPassword, verifyPassword } from "./crypto/password-hasher";
export { SecretBox } from "./crypto/secret-box";
export { sha256Hex } from "./crypto/sha256-hex";
export type { Database } from "./db/database";
export { AppError, type AppErrorCode } from "./errors/app-error";
export { newId } from "./ids/new-id";
export { createLogger, type Logger, type LogLevel } from "./logging/logger";
export type { ActorEnv, ActorVariables } from "./http/actor-env";
export { actorOf, can, requirePermission, requireSignIn } from "./http/guards";
export { recordChange, type ChangeContext, type ChangeEntry } from "./audit/change-context";
