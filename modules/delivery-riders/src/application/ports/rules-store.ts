/** Where the delivery rules are kept. */

import type { DeliveryRules } from "../../domain/delivery-rules";

export interface RulesStore {
  read(): Promise<DeliveryRules>;
  write(rules: DeliveryRules, by: string | null, now: Date): Promise<void>;
}
