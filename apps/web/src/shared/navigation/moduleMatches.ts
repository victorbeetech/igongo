// The menu search rule: does a module match what the person typed? It looks
// at the module's name and the names of its screens, so typing "payslip" finds
// Payroll even though the word is not in the module's name.

import type { ModuleSpec } from "@/shared/catalog/types";

/** True when [query] is empty or appears in the module's name or any of its screen names. */
export function moduleMatches(module: ModuleSpec, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return module.name.toLowerCase().includes(q) || module.screens.some((s) => s.name.toLowerCase().includes(q));
}
