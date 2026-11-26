// Totals for a year or a whole working life.

import '../../../shared/api/api_client.dart';

/// Earnings totals.
class EarningsTotals {
  /// Creates totals.
  const EarningsTotals({
    required this.gross,
    required this.net,
    required this.cashBonuses,
    required this.buffetPasses,
    required this.advancesTaken,
    required this.payslips,
  });

  /// Reads them from the API's JSON.
  factory EarningsTotals.fromJson(Json json) {
    int n(String key) => (json[key] as num?)?.toInt() ?? 0;
    return EarningsTotals(
      gross: n('gross'),
      net: n('net'),
      cashBonuses: n('cashBonuses'),
      buffetPasses: n('buffetPasses'),
      advancesTaken: n('advancesTaken'),
      payslips: n('payslips'),
    );
  }

  /// Gross pay.
  final int gross;

  /// Net pay.
  final int net;

  /// Cash bonuses earned.
  final int cashBonuses;

  /// Buffet passes given.
  final int buffetPasses;

  /// Advances and loans taken.
  final int advancesTaken;

  /// How many payslips.
  final int payslips;
}
