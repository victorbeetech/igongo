// One number on the management dashboard.

import '../../../shared/api/api_client.dart';
import '../../../shared/format/ugx.dart';

/// A dashboard number.
class Kpi {
  /// Creates a number.
  const Kpi({required this.key, required this.label, required this.value, required this.unit});

  /// Reads one from the API's JSON.
  factory Kpi.fromJson(Json json) =>
      Kpi(key: '${json['key']}', label: '${json['label']}', value: json['value'] as num, unit: '${json['unit']}');

  /// Its key.
  final String key;

  /// What it counts.
  final String label;

  /// The number.
  final num value;

  /// `count`, `ugx` or `percent`.
  final String unit;

  /// The number as people read it.
  String get shown => switch (unit) {
    'ugx' => ugx(value),
    'percent' => '${value.round()}%',
    _ => '${value.round()}',
  };
}
