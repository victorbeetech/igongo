/** Where file records are kept. */

import type { StoredFile } from "../../domain/stored-file";

export interface FileRepository {
  get(id: string): Promise<StoredFile | null>;
  /** Live files among [ids]. */
  many(ids: string[]): Promise<StoredFile[]>;
  add(file: StoredFile): Promise<void>;
  markRemoved(id: string, at: Date): Promise<void>;
}
