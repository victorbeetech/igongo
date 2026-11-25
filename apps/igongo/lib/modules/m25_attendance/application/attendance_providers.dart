// Attendance's live data for the app's screens (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/attendance_api.dart';
import '../domain/attendance_status.dart';
import '../domain/day_summary.dart';

/// The Attendance API on the app's client.
final attendanceApiProvider = Provider((ref) => AttendanceApi(ref.watch(apiClientProvider)));

/// My status now; refreshed after each clock.
final attendanceStatusProvider = FutureProvider.autoDispose<AttendanceStatus>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(attendanceApiProvider).status();
});

/// My last 31 days.
final myDaysProvider = FutureProvider.autoDispose<List<DaySummary>>((ref) {
  ref.watch(sessionProvider);
  String day(DateTime d) => d.toIso8601String().substring(0, 10);
  final now = DateTime.now();
  return ref
      .watch(attendanceApiProvider)
      .myDays(day(now.subtract(const Duration(days: 30))), day(now.add(const Duration(days: 1))));
});
