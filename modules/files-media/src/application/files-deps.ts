/** Everything Files & Media's use cases need, given by the gateway per request. */

import type { ChangeContext } from "@igongo/core";
import type { BlobStore } from "./ports/blob-store";
import type { FileRepository } from "./ports/file-repository";
import type { FileRulesStore } from "./ports/rules-store";

export interface FilesDeps {
  files: FileRepository;
  /** Null when the R2 bucket is not bound yet (uploads then say "not set up"). */
  blobs: BlobStore | null;
  rules: FileRulesStore;
  change: ChangeContext;
}
