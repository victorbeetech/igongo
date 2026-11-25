// The menu search rule: does a module match what the person typed? It looks
// at the module's name and the names of its screens, so typing "payslip" finds
// Payroll even though the word is not in the module's name. Same rule as the web.

import 'module_spec.dart';

/// True when [query] is empty or appears in [module]'s name or any of its screen names.
bool moduleMatches(ModuleSpec module, String query) {
  final q = query.trim().toLowerCase();
  if (q.isEmpty) return true;
  return module.name.toLowerCase().contains(q) || module.screens.any((s) => s.name.toLowerCase().contains(q));
}
