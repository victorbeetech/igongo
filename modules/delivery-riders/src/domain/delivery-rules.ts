/**
 * The super admin's delivery rules (S66-02 and the module settings): zones
 * with fees and times, how jobs are assigned, the proof of delivery, and
 * cash. Fees and pay are data the hotel sets; none are in code.
 */

import type { ZoneQuote } from "@igongo/contracts/delivery-riders";

export interface DeliveryRules {
  zones: ZoneQuote[];
  /** auto: the free online rider with the fewest jobs gets it. dispatcher: a person assigns. */
  assignment: "auto" | "dispatcher";
  /** code: the guest's 4-digit code is needed to finish. none: the rider just confirms. */
  proof: "code" | "none";
  ridersCarryCash: boolean;
  /** The most cash a rider may hold before handing in, whole shillings (0 = no limit). */
  cashLimit: number;
  /** What a rider earns per delivered trip, whole shillings. */
  payPerTrip: number;
}

export const DEFAULT_DELIVERY_RULES: DeliveryRules = { zones: [], assignment: "dispatcher", proof: "code", ridersCarryCash: true, cashLimit: 0, payPerTrip: 0 };
