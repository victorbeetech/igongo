/**
 * Permission keys Files & Media checks. Besides these, anyone who may add
 * photos in a module may upload and see that module's files: the key
 * `<module>.photos.create` (or `.view`), so a fault reporter needs nothing extra.
 */

export const FILE_PERMISSIONS = {
  /** Upload for any purpose. */
  create: "files-media.files.create",
  /** See every file. */
  view: "files-media.files.view",
  /** Remove anyone's file. */
  delete: "files-media.files.delete",
  settings: "files-media.settings.edit",
} as const;

/** The per-module key that lets a person upload or see that module's files. */
export const purposePermission = (purpose: string, action: "create" | "view") => `${purpose}.photos.${action}`;
