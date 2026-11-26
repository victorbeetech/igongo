// A salary advance or staff loan, as the staff member sees it.

import '../../../shared/api/api_client.dart';

/// An advance or loan.
class Advance {
  /// Creates one.
  const Advance({
    required this.id,
    required this.number,
    required this.kind,
    required this.amount,
    required this.instalments,
    required this.instalmentAmount,
    required this.startPeriod,
    required this.status,
    required this.repaid,
    required this.reason,
    this.decisionNote,
  });

  /// Reads one from the API's JSON.
  factory Advance.fromJson(Json json) => Advance(
    id: '${json['id']}',
    number: '${json['number']}',
    kind: '${json['kind']}',
    amount: (json['amount'] as num).toInt(),
    instalments: (json['instalments'] as num).toInt(),
    instalmentAmount: (json['instalmentAmount'] as num).toInt(),
    startPeriod: '${json['startPeriod']}',
    status: '${json['status']}',
    repaid: (json['repaid'] as num?)?.toInt() ?? 0,
    reason: '${json['reason']}',
    decisionNote: json['decisionNote'] as String?,
  );

  /// Its ID.
  final String id;

  /// Such as `ADV-0007`.
  final String number;

  /// `advance` or `loan`.
  final String kind;

  /// Whole shillings.
  final int amount;

  /// Months to repay.
  final int instalments;

  /// Each month's repayment.
  final int instalmentAmount;

  /// The first pay month, `YYYY-MM`.
  final String startPeriod;

  /// Such as `requested` or `disbursed`.
  final String status;

  /// Repaid so far.
  final int repaid;

  /// Why it was asked for.
  final String reason;

  /// The manager's note, if any.
  final String? decisionNote;

  /// Left to repay.
  int get left => amount - repaid < 0 ? 0 : amount - repaid;
}
