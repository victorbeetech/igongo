// Reports & Analytics live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/reports_api.dart';
import '../domain/dashboard.dart';
import '../domain/report_run.dart';
import '../domain/saved_report.dart';

/// The Reports API on the app's client.
final reportsApiProvider = Provider((ref) => ReportsApi(ref.watch(apiClientProvider)));

/// The dashboard for the last N days (1, 7 or 30).
final dashboardProvider = FutureProvider.autoDispose.family<Dashboard, int>((ref, days) {
  ref.watch(sessionProvider);
  return ref.watch(reportsApiProvider).dashboard(days);
});

/// My saved reports.
final savedReportsProvider = FutureProvider.autoDispose<List<SavedReport>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(reportsApiProvider).savedReports();
});

/// A saved report's past runs.
final reportRunsProvider = FutureProvider.autoDispose.family<List<ReportRun>, String>((ref, id) {
  return ref.watch(reportsApiProvider).runs(id);
});

/// One run with its numbers.
final reportRunProvider = FutureProvider.autoDispose.family<ReportRun, String>((ref, id) {
  return ref.watch(reportsApiProvider).runOf(id);
});
