// The super admin's limits for one kind (advance or loan).

import '../../../shared/api/api_client.dart';

/// One kind's limits.
class KindRule {
  /// Creates the limits.
  const KindRule({required this.enabled, required this.maxAmount, required this.maxInstalments});

  /// Reads them from the API's JSON.
  factory KindRule.fromJson(Json json) => KindRule(
    enabled: json['enabled'] == true,
    maxAmount: (json['maxAmount'] as num?)?.toInt() ?? 0,
    maxInstalments: (json['maxInstalments'] as num?)?.toInt() ?? 1,
  );

  /// Staff may ask.
  final bool enabled;

  /// The most they may ask for (0 means no limit).
  final int maxAmount;

  /// The most months to repay.
  final int maxInstalments;
}
