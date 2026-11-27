// The ordering rules the super admin set (S62-16), as the app needs them.

import '../../../shared/api/api_client.dart';
import 'type_rule.dart';

/// The ordering rules.
class OrderingRules {
  /// Creates the rules.
  const OrderingRules({required this.types, required this.preorderMinNoticeMinutes, this.containerFee = 0});

  /// Reads them from the API's JSON.
  factory OrderingRules.fromJson(Json json) => OrderingRules(
    types: {for (final e in (json['types'] as Json? ?? const {}).entries) e.key: TypeRule.fromJson(e.value as Json)},
    preorderMinNoticeMinutes: (json['preorderMinNoticeMinutes'] as num?)?.toInt() ?? 60,
    containerFee: (json['containerFee'] as num?)?.toInt() ?? 0,
  );

  /// Each order type's rule.
  final Map<String, TypeRule> types;

  /// How early a pre-order or delivery time must be set.
  final int preorderMinNoticeMinutes;

  /// The takeaway container fee the super admin set, in shillings (0 = containers are free).
  final int containerFee;

  /// The types [outlet] takes.
  List<String> typesAt(String outlet) => [
    for (final t in types.entries)
      if (t.value.at(outlet)) t.key,
  ];
}
