// My lifetime earnings statement: totals, each year, and every payslip.

import '../../../shared/api/api_client.dart';
import 'earnings_totals.dart';
import 'payslip.dart';

/// The statement.
class EarningsStatement {
  /// Creates the statement.
  const EarningsStatement({required this.lifetime, required this.years, required this.payslips});

  /// Reads it from `GET /api/earnings/mine`.
  factory EarningsStatement.fromJson(Json json) => EarningsStatement(
    lifetime: EarningsTotals.fromJson(json['lifetime'] as Json),
    years: [
      for (final y in json['years'] as List) ('${(y as Json)['year']}', EarningsTotals.fromJson(y['totals'] as Json)),
    ],
    payslips: [for (final p in json['payslips'] as List) Payslip.fromJson(p as Json)]
      ..sort((a, b) => b.period.compareTo(a.period)),
  );

  /// The whole working life.
  final EarningsTotals lifetime;

  /// Each year, newest first.
  final List<(String, EarningsTotals)> years;

  /// Every payslip, newest first.
  final List<Payslip> payslips;
}
