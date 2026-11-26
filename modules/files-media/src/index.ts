/**
 * Files & Media (module 11) of the Igongo API. The gateway imports only this
 * file. See modules/files-media/README.md.
 */

export type { BlobStore } from "./application/ports/blob-store";
export type { FilesDeps } from "./application/files-deps";
export { DEFAULT_FILE_RULES, ruleBreak, type FileRules } from "./domain/file-rules";
export { memoryBlobStore } from "./infrastructure/blob/memory-blob-store";
export { r2BlobStore } from "./infrastructure/blob/r2-blob-store";
export { DrizzleFileRepository } from "./infrastructure/db/drizzle-file-repository";
export { SettingsFileRulesStore } from "./infrastructure/db/settings-rules-store";
export { fileDirectory } from "./infrastructure/file-directory";
export { FILE_PERMISSIONS } from "./presentation/permissions";
export { filesRouter } from "./presentation/files-router";
