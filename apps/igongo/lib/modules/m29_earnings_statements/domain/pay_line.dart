// A named amount on a payslip, such as "Transport" or "PAYE".

import '../../../shared/api/api_client.dart';

/// One payslip line.
class PayLine {
  /// Creates a line.
  const PayLine(this.name, this.amount);

  /// Reads one from the API's JSON.
  factory PayLine.fromJson(Json json) => PayLine('${json['name']}', (json['amount'] as num).toInt());

  /// Reads a list from [list] (a JSON array, or null).
  static List<PayLine> listOf(Object? list) => [
    for (final l in (list as List?) ?? const []) PayLine.fromJson(l as Json),
  ];

  /// The line's name.
  final String name;

  /// Whole shillings.
  final int amount;
}
