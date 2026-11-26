/** Everything CRM's use cases need, given by the gateway per request. */

import type { ChangeContext } from "@igongo/core";
import type { CrmSettingsStore } from "./ports/crm-settings-store";
import type { ProfileRepository } from "./ports/profile-repository";

export interface CrmDeps {
  profiles: ProfileRepository;
  settings: CrmSettingsStore;
  change: ChangeContext;
}
