/**
 * Use case: store one uploaded file (S11-01). Steps: check the super admin's
 * limits, put the bytes in R2 under a fresh key, keep the record, audit it.
 */

import { AppError, newId, recordChange } from "@igongo/core";
import { ruleBreak } from "../../domain/file-rules";
import type { StoredFile } from "../../domain/stored-file";
import type { FilesDeps } from "../files-deps";

export async function uploadFile(deps: FilesDeps, by: { userId: string; name: string }, input: { name: string; type: string; bytes: Uint8Array<ArrayBuffer>; purpose: string }): Promise<StoredFile> {
  if (!deps.blobs) throw new AppError("not_configured", "File storage is not set up yet.");
  // 1. The limits.
  const broken = ruleBreak(await deps.rules.read(), { type: input.type, size: input.bytes.byteLength });
  if (broken) throw new AppError("bad_request", broken);
  // 2. The bytes, under purpose/year/id so the bucket stays tidy.
  const id = newId("fil");
  const key = `${input.purpose}/${deps.change.now.getUTCFullYear()}/${id}`;
  await deps.blobs.put(key, input.bytes, input.type);
  // 3. The record and the audit entry.
  const file: StoredFile = { id, name: input.name, type: input.type, size: input.bytes.byteLength, key, purpose: input.purpose, uploadedBy: by.userId, uploaderName: by.name, createdAt: deps.change.now, removedAt: null };
  await deps.files.add(file);
  await recordChange(deps.change, { module: "files-media", action: "file.uploaded", recordType: "file", recordId: id, summary: `Uploaded ${input.name} for ${input.purpose}` });
  return file;
}
