// Reports & Analytics live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/reports_api.dart';
import '../domain/dashboard.dart';

/// The Reports API on the app's client.
final reportsApiProvider = Provider((ref) => ReportsApi(ref.watch(apiClientProvider)));

/// The dashboard for the last N days (1, 7 or 30).
final dashboardProvider = FutureProvider.autoDispose.family<Dashboard, int>((ref, days) {
  ref.watch(sessionProvider);
  return ref.watch(reportsApiProvider).dashboard(days);
});
