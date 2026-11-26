// A reward given to a staff member: a cash bonus or buffet passes.

import '../../../shared/api/api_client.dart';

/// A reward.
class Bonus {
  /// Creates a reward.
  const Bonus({
    required this.id,
    required this.kind,
    required this.amount,
    required this.passes,
    required this.passesUsed,
    required this.validUntil,
    required this.reason,
    required this.status,
    required this.awardedByName,
  });

  /// Reads one from the API's JSON.
  factory Bonus.fromJson(Json json) => Bonus(
    id: '${json['id']}',
    kind: '${json['kind']}',
    amount: (json['amount'] as num?)?.toInt() ?? 0,
    passes: (json['passes'] as num?)?.toInt() ?? 0,
    passesUsed: (json['passesUsed'] as num?)?.toInt() ?? 0,
    validUntil: json['validUntil'] as String?,
    reason: '${json['reason']}',
    status: '${json['status']}',
    awardedByName: '${json['awardedByName']}',
  );

  /// Its ID.
  final String id;

  /// `cash` or `buffet`.
  final String kind;

  /// Cash amount.
  final int amount;

  /// Buffet passes given.
  final int passes;

  /// Buffet passes used.
  final int passesUsed;

  /// The last day passes can be used, `YYYY-MM-DD`.
  final String? validUntil;

  /// Why it was given.
  final String reason;

  /// Such as `approved` or `paid`.
  final String status;

  /// Who gave it.
  final String awardedByName;
}
