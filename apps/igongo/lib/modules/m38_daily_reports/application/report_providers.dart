// Daily Reports' live data for the app's screens (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/reports_api.dart';
import '../domain/my_report_day.dart';

/// The Daily Reports API on the app's client.
final reportsApiProvider = Provider((ref) => ReportsApi(ref.watch(apiClientProvider)));

/// Today's report for me; reloads when the session changes.
final myReportProvider = FutureProvider.autoDispose<MyReportDay>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(reportsApiProvider).today();
});
