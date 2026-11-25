/** Where the report template is kept. */

import type { ReportTemplate } from "../../domain/report-template";

export interface TemplateStore {
  read(): Promise<ReportTemplate>;
  write(template: ReportTemplate, by: string | null, now: Date): Promise<void>;
}
