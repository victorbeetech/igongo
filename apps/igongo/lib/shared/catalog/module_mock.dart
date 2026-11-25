// Sample data for one module's screens, invented for the clickable prototype.

/// Sample data for a module's screens. Invented for the prototype.
class ModuleMock {
  /// Creates the sample data. Only the generator calls this.
  const ModuleMock({required this.items, required this.statuses, required this.kpis, required this.fields});

  /// Record names shown in lists, such as "Card 0148 · Atuhaire Grace".
  final List<String> items;

  /// Status words for chips, such as Active or Blocked.
  final List<String> statuses;

  /// Dashboard numbers as (label, value).
  final List<(String, String)> kpis;

  /// Form field labels used when a screen names none.
  final List<String> fields;
}
