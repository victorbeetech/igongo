/**
 * A module's whole set-up, saved as data in its own settings table: the
 * record types (with fields and statuses) and the switches for comments.
 * The module's code gives the defaults; the super admin changes anything
 * on the settings screen, with no code change and no app update.
 */

import type { RecordType } from "./record-type";

export interface RecordConfig {
  types: RecordType[];
  /** People who can see a record may comment on it. */
  comments: boolean;
  /** A short note shown at the top of the module's screens, such as opening hours or a policy. */
  notice: string;
}
