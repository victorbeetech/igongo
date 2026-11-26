// Advances & Loans live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/advances_api.dart';
import '../domain/my_advances.dart';

/// The Advances API on the app's client.
final advancesApiProvider = Provider((ref) => AdvancesApi(ref.watch(apiClientProvider)));

/// My advances and the rules.
final myAdvancesProvider = FutureProvider.autoDispose<MyAdvances>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(advancesApiProvider).mine();
});
