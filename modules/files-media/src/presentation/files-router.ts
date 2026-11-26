/**
 * Files & Media HTTP routes, mounted by the gateway at `/api/files`.
 *
 *   POST    /files               upload (JSON with base64 data)        S11-01
 *   GET     /files/settings      the upload limits                     S11-05
 *   PUT     /files/settings      change them                           S11-05
 *   GET     /files/:id           the file itself (private cache)       S11-02
 *   GET     /files/:id/info      its record
 *   DELETE  /files/:id           remove (uploader or remover)
 */

import { zValidator } from "@hono/zod-validator";
import { actorOf, AppError, can, fromBase64, recordChange, requirePermission, requireSignIn, type ActorEnv } from "@igongo/core";
import { Hono, type Context } from "hono";
import type { FilesDeps } from "../application/files-deps";
import { uploadFile } from "../application/use-cases/upload-file";
import type { StoredFile } from "../domain/stored-file";
import { FILE_PERMISSIONS as P, purposePermission } from "./permissions";
import { rulesBody, uploadBody } from "./request-schemas";

export function filesRouter(deps: (c: Context<ActorEnv>) => FilesDeps) {
  /** The file in the address, if the caller may see it. @throws AppError `not_found` */
  async function visible(c: Context<ActorEnv>): Promise<StoredFile> {
    const file = await deps(c).files.get(c.req.param("id") as string);
    const actor = actorOf(c);
    const allowed = file && (file.uploadedBy === actor.userId || can(actor, P.view) || can(actor, purposePermission(file.purpose, "view")));
    if (!file || file.removedAt || !allowed) throw new AppError("not_found", "File not found.");
    return file;
  }

  return new Hono<ActorEnv>()
    .post("/", requireSignIn, zValidator("json", uploadBody), async (c) => {
      const actor = actorOf(c);
      const body = c.req.valid("json");
      // Anyone who may add photos in that module may upload for it.
      if (!can(actor, P.create) && !can(actor, purposePermission(body.purpose, "create"))) throw new AppError("permission_denied", `You cannot add files to ${body.purpose}.`);
      let bytes: Uint8Array<ArrayBuffer>;
      try {
        bytes = fromBase64(body.data);
      } catch {
        throw new AppError("bad_request", "The file data is not valid base64.");
      }
      const file = await uploadFile(deps(c), { userId: actor.userId, name: actor.name }, { name: body.name, type: body.type, bytes, purpose: body.purpose });
      return c.json({ id: file.id, name: file.name, type: file.type, size: file.size }, 201);
    })
    .get("/settings", requireSignIn, async (c) => c.json(await deps(c).rules.read()))
    .put("/settings", requirePermission(P.settings), zValidator("json", rulesBody), async (c) => {
      const d = deps(c);
      const rules = c.req.valid("json");
      await d.rules.write(rules, d.change.actorId, d.change.now);
      await recordChange(d.change, { module: "files-media", action: "rules.changed", recordType: "settings", recordId: "rules", summary: `File limits: ${rules.maxMb} MB, ${rules.allowedTypes.join(", ")}` });
      return c.json(rules);
    })
    .get("/:id", async (c) => {
      const file = await visible(c);
      const blob = await deps(c).blobs?.get(file.key);
      if (!blob) throw new AppError("not_found", "File not found.");
      // Photos show inline; anything else only downloads. Never sniffed, never run as a page.
      const inline = file.type.startsWith("image/");
      return new Response(blob.body, {
        headers: {
          "content-type": file.type,
          "cache-control": "private, max-age=86400",
          "content-disposition": `${inline ? "inline" : "attachment"}; filename="${file.name.replace(/[^\w. -]/g, "")}"`,
          "x-content-type-options": "nosniff",
          "content-security-policy": "default-src 'none'; sandbox",
        },
      });
    })
    .get("/:id/info", async (c) => c.json(await visible(c)))
    .delete("/:id", async (c) => {
      const d = deps(c);
      const file = await visible(c);
      const actor = actorOf(c);
      if (file.uploadedBy !== actor.userId && !can(actor, P.delete)) throw new AppError("permission_denied", `You need the permission ${P.delete}.`);
      await d.files.markRemoved(file.id, d.change.now);
      await recordChange(d.change, { module: "files-media", action: "file.removed", recordType: "file", recordId: file.id, summary: `Removed ${file.name}` });
      return c.body(null, 204);
    });
}
