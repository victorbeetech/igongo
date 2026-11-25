/** A module's switch as the console shows it, with its catalog details. */

import type { ModuleState } from "@igongo/contracts/super-admin";

export interface ModuleRow extends ModuleState {
  number: number;
  name: string;
  group: string;
  /** False for core modules the spec says can never be switched off. */
  canSwitchOff: boolean;
}
