// The super admin's rule for one order type: on or off, at which outlets,
// and when it is paid (before, a deposit, or later).

import '../../../shared/api/api_client.dart';

/// One order type's rule.
class TypeRule {
  /// Creates a rule.
  const TypeRule({required this.enabled, required this.outlets, required this.payment});

  /// Reads one from the API's JSON.
  factory TypeRule.fromJson(Json json) => TypeRule(
    enabled: json['enabled'] == true,
    outlets: [for (final o in json['outlets'] as List<dynamic>? ?? const []) '$o'],
    payment: '${json['payment']}',
  );

  /// True when guests may order this way.
  final bool enabled;

  /// Outlets that take it; empty means all.
  final List<String> outlets;

  /// `before`, `deposit` or `later`.
  final String payment;

  /// True when [outlet] takes this type.
  bool at(String outlet) => enabled && (outlets.isEmpty || outlets.contains(outlet));
}
