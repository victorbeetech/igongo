// Live profile numbers for the Me screen (Riverpod). The provider reloads
// when the session changes, so a new sign-in never shows the last person's numbers.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/me_stats_api.dart';
import '../domain/me_stats.dart';

/// The profile numbers API on the app's client.
final meStatsApiProvider = Provider((ref) => MeStatsApi(ref.watch(apiClientProvider)));

/// My profile numbers. Reloads when the session changes.
final meStatsProvider = FutureProvider.autoDispose<MeStats>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(meStatsApiProvider).load();
});
