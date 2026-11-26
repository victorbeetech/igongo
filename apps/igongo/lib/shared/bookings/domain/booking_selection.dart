// The day(s) a guest picked: one day for tickets, events and tables, or check-in
// and check-out for stays.

import '../../format/day_key.dart';

/// The picked days.
class BookingSelection {
  /// Creates a selection starting on [from]; [to] is the check-out day for stays.
  const BookingSelection({required this.from, this.to});

  /// The first day (check-in for stays).
  final DateTime from;

  /// The check-out day for stays, or null for a single day.
  final DateTime? to;

  /// Nights between check-in and check-out (0 for a single day).
  int get nights {
    final end = to;
    return end == null ? 0 : end.difference(from).inDays;
  }

  /// The first day as `YYYY-MM-DD`, for the API.
  String get fromKey => dayKey(from);

  /// The check-out day as `YYYY-MM-DD`, or null for a single day.
  String? get toKey {
    final end = to;
    return end == null ? null : dayKey(end);
  }
}
