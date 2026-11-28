/** Where the guest content document is kept. The infrastructure implements it. */

import type { GuestContent } from "../../domain/content";

export interface GuestContentStore {
  /** The saved document, or the empty one before anything is saved. */
  read(): Promise<GuestContent>;
  /** Replaces the whole document, recording who saved it and when. */
  write(content: GuestContent, by: string | null, now: Date): Promise<void>;
}
