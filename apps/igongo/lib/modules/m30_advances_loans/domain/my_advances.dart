// My advances and loans, with the rules for asking.

import '../../../shared/api/api_client.dart';
import 'advance.dart';
import 'kind_rule.dart';

/// What `GET /api/advances/mine` returns.
class MyAdvances {
  /// Creates the page.
  const MyAdvances({required this.items, required this.advance, required this.loan});

  /// Reads it from the API's JSON.
  factory MyAdvances.fromJson(Json json) {
    final rules = json['rules'] as Json;
    return MyAdvances(
      items: [for (final a in json['items'] as List) Advance.fromJson(a as Json)],
      advance: KindRule.fromJson(rules['advance'] as Json),
      loan: KindRule.fromJson(rules['loan'] as Json),
    );
  }

  /// Mine, newest first.
  final List<Advance> items;

  /// The salary advance limits.
  final KindRule advance;

  /// The staff loan limits.
  final KindRule loan;
}
