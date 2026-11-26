/** Where bonuses and buffet uses are kept. */

import type { Bonus, BonusKind, BonusStatus } from "../../domain/bonus";
import type { BuffetUse } from "../../domain/buffet-use";

export interface BonusRepository {
  get(id: string): Promise<Bonus | null>;
  list(filter: { staffId?: string; department?: string; status?: BonusStatus; kind?: BonusKind; limit: number }): Promise<Bonus[]>;
  save(bonus: Bonus): Promise<void>;
  /** Uses one pass: adds the use and raises `passesUsed` only if a pass is left. False when none was left. */
  usePass(use: BuffetUse): Promise<boolean>;
  /** True when [staffId] already used a pass on [workDate]. */
  usedOn(staffId: string, workDate: string): Promise<boolean>;
  uses(bonusId: string): Promise<BuffetUse[]>;
}
