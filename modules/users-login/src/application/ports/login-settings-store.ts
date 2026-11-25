/** Where the login method switches and the login policy are stored. */

import type { LoginMethod } from "@igongo/contracts/users-login";
import type { LoginMethodSetting } from "../../domain/login-method-setting";
import type { LoginPolicy } from "../../domain/login-policy";

export interface LoginSettingsStore {
  /** Every method, with the spec defaults for any not saved yet. */
  methods(): Promise<LoginMethodSetting[]>;
  saveMethod(setting: LoginMethodSetting, by: string | null): Promise<void>;
  /** The policy, with defaults for any key not saved yet. */
  policy(): Promise<LoginPolicy>;
  savePolicy(patch: Partial<LoginPolicy>): Promise<void>;
  /** Convenience: one method's setting. */
  method(method: LoginMethod): Promise<LoginMethodSetting>;
}
