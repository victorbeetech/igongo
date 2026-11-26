/** Files & Media's `FileDirectory` contract, for modules that keep file IDs. */

import type { FileDirectory } from "@igongo/contracts/files-media";
import type { FileRepository } from "../application/ports/file-repository";

export function fileDirectory(files: FileRepository): FileDirectory {
  return {
    known: async (ids) => (await files.many([...new Set(ids)])).map((f) => ({ id: f.id, name: f.name, type: f.type, size: f.size })),
  };
}
