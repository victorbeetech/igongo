// One month's payslip as the staff member sees it.

import '../../../shared/api/api_client.dart';
import 'pay_line.dart';

/// A payslip.
class Payslip {
  /// Creates a payslip.
  const Payslip({
    required this.id,
    required this.period,
    required this.basic,
    required this.earnings,
    required this.gross,
    required this.deductions,
    required this.totalDeductions,
    required this.net,
    required this.status,
  });

  /// Reads one from the API's JSON.
  factory Payslip.fromJson(Json json) => Payslip(
    id: '${json['payslipId']}',
    period: '${json['period']}',
    basic: (json['basic'] as num).toInt(),
    earnings: PayLine.listOf(json['earnings']),
    gross: (json['gross'] as num).toInt(),
    deductions: PayLine.listOf(json['deductions']),
    totalDeductions: (json['totalDeductions'] as num).toInt(),
    net: (json['net'] as num).toInt(),
    status: '${json['status']}',
  );

  /// The payslip's ID.
  final String id;

  /// The month, `YYYY-MM`.
  final String period;

  /// Basic pay.
  final int basic;

  /// Allowances, bonuses and other pay.
  final List<PayLine> earnings;

  /// Everything earned.
  final int gross;

  /// Taxes, advances and other deductions.
  final List<PayLine> deductions;

  /// All deductions.
  final int totalDeductions;

  /// What was paid.
  final int net;

  /// The pay run's status, such as `paid`.
  final String status;
}
