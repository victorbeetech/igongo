/**
 * The super admin's payment method switches (S77-06): each method on or
 * off for the whole system, then limited to some outlets and modules.
 * Provider keys are not here: they live encrypted in the Super Admin
 * Console (Integrations), and only the provider environment is set here.
 */

import { PAYMENT_METHODS, type PaymentMethod } from "@igongo/contracts/payments";
import { recordOf } from "@igongo/core";

export interface MethodSwitch {
  enabled: boolean;
  /** Outlets it is allowed at; empty means every outlet. */
  outlets: string[];
  /** Selling modules it is allowed for; empty means every module. */
  modules: string[];
}

export interface MethodSettings {
  methods: Record<PaymentMethod, MethodSwitch>;
  /** Whether staff may record cash and bank payments by hand. */
  allowManual: boolean;
  /** `sandbox` while testing with the providers, `live` after go-live. */
  environment: "sandbox" | "live";
}

/** Every method is built; only cash is on until the hotel agrees each provider. */
export const DEFAULT_METHOD_SETTINGS: MethodSettings = {
  methods: recordOf(PAYMENT_METHODS, (m): MethodSwitch => ({ enabled: m === "cash", outlets: [], modules: [] })),
  allowManual: true,
  environment: "sandbox",
};

/** True when [method] may be used for [module] at [outlet]. */
export function methodAllowed(settings: MethodSettings, method: PaymentMethod, module: string, outlet: string | null): boolean {
  const s = settings.methods[method];
  if (!s?.enabled) return false;
  if (s.modules.length && !s.modules.includes(module)) return false;
  return !s.outlets.length || (outlet !== null && s.outlets.includes(outlet));
}
