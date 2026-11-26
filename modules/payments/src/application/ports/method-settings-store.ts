/** Where the payment method switches are kept. */

import type { MethodSettings } from "../../domain/method-settings";

export interface MethodSettingsStore {
  read(): Promise<MethodSettings>;
  write(settings: MethodSettings, by: string | null, now: Date): Promise<void>;
}
