// Earnings Statements live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/earnings_api.dart';
import '../domain/earnings_statement.dart';

/// The Earnings API on the app's client.
final earningsApiProvider = Provider((ref) => EarningsApi(ref.watch(apiClientProvider)));

/// My statement.
final myStatementProvider = FutureProvider.autoDispose<EarningsStatement>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(earningsApiProvider).mine();
});
