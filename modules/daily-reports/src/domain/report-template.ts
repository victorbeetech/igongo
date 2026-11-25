/**
 * The super admin's daily report template (S38-07): the sections every
 * report asks for, and the time reports are due.
 */

export interface ReportTemplate {
  sections: string[];
  /** When reports are due, `HH:MM` hotel time. */
  dueBy: string;
}

export const DEFAULT_TEMPLATE: ReportTemplate = {
  sections: ["What I did today", "Problems or faults", "Plan for tomorrow"],
  dueBy: "18:00",
};
