// One result of the portal search: a module, a page or a pop-up.

/** What kind of thing a result is. */
export type SearchHitKind = "module" | "page" | "popup";

/** One search result, ready to show as a link. */
export interface SearchHit {
  /** Module, page or pop-up. */
  kind: SearchHitKind;
  /** The name to show, such as "Payslip". */
  title: string;
  /** Where it lives, such as "Payroll", or its purpose for a module. */
  context: string;
  /** The address it opens. */
  href: string;
  /** The module number, for its icon. */
  moduleCode: string;
}
