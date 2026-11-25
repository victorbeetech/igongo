/** Where the console keeps module switches, settings and sealed keys. */

import type { ModuleState } from "@igongo/contracts/super-admin";

export interface StoredSecret {
  key: string;
  sealed: string;
  lastFour: string;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface ConsoleStore {
  /** Saved switches (modules without a row are on). */
  switches(): Promise<ModuleState[]>;
  saveSwitch(state: ModuleState, by: string | null): Promise<void>;
  /** A saved settings section, or null when never saved. */
  section(name: string): Promise<unknown>;
  saveSection(name: string, value: unknown, by: string | null): Promise<void>;
  secrets(): Promise<StoredSecret[]>;
  secret(key: string): Promise<StoredSecret | null>;
  saveSecret(key: string, sealed: string, lastFour: string, by: string | null): Promise<void>;
  deleteSecret(key: string): Promise<boolean>;
}
