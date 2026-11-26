/**
 * Public contract of Files & Media (module 11). Modules keep only file IDs
 * (such as the photos on a fault report); the files themselves live in
 * Files & Media and are served at `/api/files/:id`.
 */

/** A stored file, as other modules see it. */
export interface FileRef {
  /** The file's ID, such as `fil_3f9c...`. */
  id: string;
  name: string;
  /** The MIME type, such as `image/jpeg`. */
  type: string;
  /** Size in bytes. */
  size: number;
}

/** Checks file IDs before a module keeps them. */
export interface FileDirectory {
  /** The files among [ids] that exist and are not removed. Unknown IDs are left out. */
  known(ids: string[]): Promise<FileRef[]>;
}
