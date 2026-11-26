/** Where the ordering rules are kept. */

import type { OrderingRules } from "../../domain/ordering-rules";

export interface RulesStore {
  read(): Promise<OrderingRules>;
  write(rules: OrderingRules, by: string | null, now: Date): Promise<void>;
}
