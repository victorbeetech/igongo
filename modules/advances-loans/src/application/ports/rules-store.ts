/** Where the advance and loan rules are kept. */

import type { AdvanceRules } from "../../domain/advance-rules";

export interface AdvanceRulesStore {
  read(): Promise<AdvanceRules>;
  write(rules: AdvanceRules, by: string | null, now: Date): Promise<void>;
}
