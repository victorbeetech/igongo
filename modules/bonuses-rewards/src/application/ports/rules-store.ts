/** Where the bonus rules are kept. */

import type { BonusRules } from "../../domain/bonus-rules";

export interface BonusRulesStore {
  read(): Promise<BonusRules>;
  write(rules: BonusRules, by: string | null, now: Date): Promise<void>;
}
