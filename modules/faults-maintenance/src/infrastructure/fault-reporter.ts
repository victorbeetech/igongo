/** Faults & Maintenance's `FaultReporter` contract, for modules that raise faults (Inspections). */

import type { FaultReporter } from "@igongo/contracts/faults-maintenance";
import type { FaultsDeps } from "../application/faults-deps";
import { reportFault } from "../application/use-cases/report-fault";

export function faultReporter(deps: FaultsDeps): FaultReporter {
  return {
    report: async (input) => {
      const fault = await reportFault(deps, { ...input, category: null });
      return { faultId: fault.id, number: fault.number };
    },
  };
}
