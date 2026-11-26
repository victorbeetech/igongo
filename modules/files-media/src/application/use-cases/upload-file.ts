/**
 * Use case: store one uploaded file (S11-01). Steps: the per-person rate
 * limit, the super admin's limits, what the bytes really are (never the
 * name or claimed type), then the bytes in R2 under a random key, the
 * record with a safe name, and the audit entry.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import { checkContent, storedName } from "../../domain/file-content";
import { ruleBreak } from "../../domain/file-rules";
import type { StoredFile } from "../../domain/stored-file";
import type { FilesDeps } from "../files-deps";

/** Uploads allowed to one person in one window. */
export const UPLOADS_PER_WINDOW = 30;
/** The rate-limit window in minutes. */
export const UPLOAD_WINDOW_MINUTES = 10;

export async function uploadFile(deps: FilesDeps, by: { userId: string; name: string }, input: { name: string; type: string; bytes: Uint8Array<ArrayBuffer>; purpose: string }): Promise<StoredFile> {
  if (!deps.blobs) throw new AppError("not_configured", "File storage is not set up yet.");
  // 1. No more than UPLOADS_PER_WINDOW files a person in UPLOAD_WINDOW_MINUTES.
  const since = new Date(deps.change.now.getTime() - UPLOAD_WINDOW_MINUTES * 60_000);
  if ((await deps.files.countSince(by.userId, since)) >= UPLOADS_PER_WINDOW) {
    throw new AppError("rate_limited", `You can upload at most ${UPLOADS_PER_WINDOW} files in ${UPLOAD_WINDOW_MINUTES} minutes. Please wait a little.`);
  }
  // 2. The super admin's limits, then the real content.
  const broken = ruleBreak(await deps.rules.read(), { type: input.type, size: input.bytes.byteLength });
  if (broken) throw new AppError("bad_request", broken);
  const content = checkContent(input.bytes, input.type);
  if ("problem" in content) throw new AppError("bad_request", content.problem);
  // 3. The bytes, under purpose/year/random id (never the sender's name).
  const id = newId("fil");
  const key = `${input.purpose}/${deps.change.now.getUTCFullYear()}/${id}`;
  await deps.blobs.put(key, input.bytes, content.type);
  // 4. The record (named by its random ID, never the sender's name) and the audit entry.
  const file: StoredFile = { id, name: storedName(id, content.type), type: content.type, size: input.bytes.byteLength, key, purpose: input.purpose, uploadedBy: by.userId, uploaderName: by.name, createdAt: deps.change.now, removedAt: null };
  await deps.files.add(file);
  await recordChange(deps.change, { module: "files-media", action: "file.uploaded", recordType: "file", recordId: id, summary: `Uploaded ${file.name} for ${input.purpose}` });
  return file;
}
