/** Where the upload limits are kept. */

import type { FileRules } from "../../domain/file-rules";

export interface FileRulesStore {
  read(): Promise<FileRules>;
  write(rules: FileRules, by: string | null, now: Date): Promise<void>;
}
