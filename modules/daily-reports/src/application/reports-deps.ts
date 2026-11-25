/** Everything Daily Reports' use cases need, given by the gateway per request. */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { ChangeContext } from "@igongo/core";
import type { ReportRepository } from "./ports/report-repository";
import type { TemplateStore } from "./ports/template-store";

export interface ReportsDeps {
  reports: ReportRepository;
  template: TemplateStore;
  staff: StaffDirectory;
  change: ChangeContext;
}
