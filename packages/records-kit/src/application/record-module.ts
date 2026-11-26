/** How a module uses the records kit: its key (for permissions and the audit), code prefix, words and default set-up. */

import type { RecordConfig } from "../domain/record-config";

export interface RecordModule {
  /** The module key, such as `lost-found`. Permissions are `<key>.records.create` and so on. */
  key: string;
  /** Record code prefix, such as `LF`. */
  prefix: string;
  /** What one record is called in messages, such as "item" or "request". */
  noun: string;
  /** The set-up a new hotel starts with. The super admin changes it from the settings screen. */
  defaults: RecordConfig;
}
